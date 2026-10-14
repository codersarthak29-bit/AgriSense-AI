import { getGeminiClient } from '../config/gemini.js';
import { AnalysisResult } from '../types/index.js';

export class AiService {
  /**
   * Run Gemini 3.8 Flash Vision Multimodal leaf diagnostic.
   */
  public async analyzeLeafImage(
    imageBase64: string,
    cropHint?: string,
    fileName?: string
  ): Promise<AnalysisResult> {
    const aiClient = getGeminiClient();
    if (!aiClient) {
      throw new Error('Gemini API is not configured.');
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const prompt = `You are a plant pathologist and agricultural diagnostic specialist.
Analyze this leaf/plant image.
User specified crop: "${cropHint || 'Auto-detect'}".

Task:
1. Identify the crop species.
2. Determine if the plant leaf exhibits disease symptoms or is healthy.
3. If diseased, identify the candidate disease (e.g., Early Blight, Late Blight, Common Rust, Bacterial Spot, Powdery Mildew, etc.) or "Healthy".
4. Identify 3 concrete visual observations (distinguish observed visual markers from diagnostic conclusions).
5. Suggest immediate remedial actions, long-term preventive measures, and safe crop management (prioritize Integrated Pest Management, aeration, organic bio-fungicides; do NOT give dangerous synthetic chemical overdoses).
6. State conditions under which a field agronomist or lab diagnostic test must be consulted.
7. Provide 2 alternative possibilities with estimated probabilities.
8. Assess severity ('None (Healthy)', 'Low', 'Moderate', 'Severe', 'Critical').

Output strictly valid JSON with this exact schema:
{
  "crop_name": string,
  "disease_name": string,
  "is_healthy": boolean,
  "severity": "None (Healthy)" | "Low" | "Moderate" | "Severe" | "Critical",
  "severity_score": number (0-100),
  "observations": [string, string, string],
  "diagnosis_summary": string,
  "recommended_actions": [string, string, string],
  "preventive_measures": [string, string, string],
  "safe_crop_management": [string, string],
  "expert_consultation_triggers": [string, string],
  "alternative_predictions": [
    { "crop_name": string, "disease_name": string, "confidence": number },
    { "crop_name": string, "disease_name": string, "confidence": number }
  ],
  "sdg_impact_note": string
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        systemInstruction:
          'You are AgriSense AI Senior Plant Pathologist. Produce rigorous, scientifically careful plant health assessments in JSON format only.',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText.trim());

    return {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64.length < 200000 ? imageBase64 : undefined,
      imageFileName: fileName || 'leaf_scan.jpg',
      crop_name: parsed.crop_name || cropHint || 'Identified Plant',
      predicted_class: (parsed.crop_name + '_' + (parsed.is_healthy ? 'healthy' : parsed.disease_name))
        .toLowerCase()
        .replace(/\s+/g, '_'),
      disease_name: parsed.disease_name || (parsed.is_healthy ? 'Healthy' : 'Undetermined Symptom'),
      is_healthy: Boolean(parsed.is_healthy),
      confidence: 0.91,
      analysis_mode: 'gemini_vision_assisted',
      confidence_calibrated: false,
      alternative_predictions: Array.isArray(parsed.alternative_predictions)
        ? parsed.alternative_predictions
        : [],
      severity: parsed.severity || (parsed.is_healthy ? 'None (Healthy)' : 'Moderate'),
      severity_score:
        typeof parsed.severity_score === 'number'
          ? parsed.severity_score
          : parsed.is_healthy
          ? 0
          : 50,
      observations: Array.isArray(parsed.observations)
        ? parsed.observations
        : ['Visual symptoms observed on leaf blade'],
      diagnosis_summary: parsed.diagnosis_summary || 'AI-assisted visual assessment completed.',
      recommended_actions: Array.isArray(parsed.recommended_actions)
        ? parsed.recommended_actions
        : ['Inspect adjacent plants for similar leaf marks'],
      preventive_measures: Array.isArray(parsed.preventive_measures)
        ? parsed.preventive_measures
        : ['Improve soil drainage and canopy ventilation'],
      safe_crop_management: Array.isArray(parsed.safe_crop_management)
        ? parsed.safe_crop_management
        : ['Use bio-fungicide formulations and monitor weekly'],
      expert_consultation_triggers: Array.isArray(parsed.expert_consultation_triggers)
        ? parsed.expert_consultation_triggers
        : ['If symptoms spread rapidly to more than 20% of the plot'],
      sdg_impact_note:
        parsed.sdg_impact_note ||
        'Early visual assessment reduces crop loss risks and prevents uninformed pesticide misuse.',
      disclaimer:
        'AI-assisted visual assessment generated by Gemini 3.8 Flash. Note: This is an exploratory visual assessment and not a laboratory-calibrated molecular diagnostic. Always verify with local agricultural extension officers before commercial spraying.',
    };
  }

  /**
   * Run Crop Care Advisor conversation using Gemini or expert knowledge fallback.
   */
  public async askAdvisor(
    question: string,
    cropContext?: string
  ): Promise<{
    reply: string;
    source: 'Gemini 3.8 Flash' | 'Agricultural Knowledge Base';
    timestamp: string;
    suggestedFollowUps: string[];
  }> {
    const aiClient = getGeminiClient();

    if (aiClient) {
      try {
        const systemInstruction = `You are AgriSense AI's Expert Crop Care Advisor.
You guide farmers, agricultural students, and agronomists with scientifically grounded, practical plant pathology advice.
Principles:
1. Provide concise, clear, and actionable advice with bullet points where appropriate.
2. Emphasize prevention, monitoring, and Integrated Pest Management (IPM).
3. Strictly avoid reckless synthetic pesticide dosage instructions. Prefer organic remedies (Bacillus subtilis, Trichoderma, copper protectants, neem, compost tea) and cultural controls (crop rotation, drip irrigation, pruning).
4. If essential context is missing (such as growth stage, weather, or specific lesion appearance), ask 1-2 focused follow-up questions.
5. Remind the user when a certified local extension officer or laboratory soil/tissue test is warranted.
6. Support UN SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption & Production).`;

        const userPrompt = `Crop context: ${cropContext || 'General Agriculture'}
Question: ${question}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || 'No response generated.';

        return {
          reply,
          source: 'Gemini 3.8 Flash',
          timestamp: new Date().toISOString(),
          suggestedFollowUps: [
            'What organic bio-fungicides are safe for this stage?',
            'How does relative humidity affect this disease cycle?',
            'What resistant crop varieties are recommended?',
          ],
        };
      } catch (geminiErr: any) {
        console.warn('Gemini chat failed, switching to expert knowledge fallback:', geminiErr?.message);
      }
    }

    // Knowledge-base fallback if Gemini is not configured or offline
    const qLower = question.toLowerCase();
    let reply = '';
    const suggestedFollowUps = [
      'How to establish proper drip irrigation?',
      'What are the optimal spacing distances for ventilation?',
      'When should a copper protectant be applied?',
    ];

    if (qLower.includes('fungal') || qLower.includes('blight') || qLower.includes('tomato')) {
      reply =
        `**Fungal Disease Management Strategy for Solanaceous Crops (Tomatoes & Potatoes)**:\n\n` +
        `1. **Canopy Aeration & Pruning**: Remove the bottom 25-30 cm of foliage to eliminate soil contact and promote airflow.\n` +
        `2. **Targeted Irrigation**: Switch from overhead sprinklers to drip irrigation. Leaf wetness duration longer than 6 hours dramatically accelerates Alternaria and Phytophthora spore germination.\n` +
        `3. **Mulching**: Apply a 5 cm layer of clean organic straw mulch under the plants to block rain splash from contaminated soil.\n` +
        `4. **Biological Controls**: Preventive foliar applications of *Bacillus subtilis* or *Trichoderma harzianum* colonize leaf surfaces and outcompete pathogenic spores.\n` +
        `5. **Scouting**: Check lower leaf undersides twice weekly, especially after morning dew periods.`;
    } else if (qLower.includes('pesticide') || qLower.includes('reduce') || qLower.includes('chemical')) {
      reply =
        `**Techniques to Reduce Unnecessary Pesticide Use (Integrated Pest Management)**:\n\n` +
        `1. **Scouting & Economic Thresholds**: Never spray on a fixed calendar schedule. Inspect 20 representative plants across a zigzag field pattern. Only treat if pest/disease pressure exceeds the economic threshold.\n` +
        `2. **Biological Antagonists**: Encourage predatory insects (ladybird beetles, parasitic wasps, lacewings) by planting flowering borders (marigolds, dill, alyssum).\n` +
        `3. **Cultural Resistance**: Choose certified disease-resistant hybrids (e.g., F1 varieties with Tm-2a, V, F1-2, N resistance).\n` +
        `4. **Bio-rational Products**: Substitute broad-spectrum synthetics with horticultural oils, insecticidal soaps, and neem extracts that degrade rapidly without toxic residues.`;
    } else if (qLower.includes('corn') || qLower.includes('rust') || qLower.includes('maize')) {
      reply =
        `**Common Rust and Foliar Disease Management in Corn (Maize)**:\n\n` +
        `1. **Pustule Monitoring**: Check leaves below the ear before the V8 vegetative stage. If cinnamon-brown pustules are sparse, natural plant resistance is usually sufficient.\n` +
        `2. **Resistant Hybrids**: Utilize hybrids containing specific Rp resistance genes (such as Rp1-D) in regions prone to seasonal rust spore fronts.\n` +
        `3. **Balanced Fertility**: Avoid excessive late-season nitrogen which generates succulent tissue that rust fungi easily penetrate; ensure sufficient potassium levels.\n` +
        `4. **Crop Residue**: For diseases like Gray Leaf Spot, chisel-plow or rotate with soybeans to interrupt pathogen overwintering.`;
    } else {
      reply =
        `**Agricultural Diagnostic Guidance**:\n\n` +
        `To give you the most accurate recommendations for **"${question}"**, please consider:\n` +
        `• **Crop & Variety**: What crop species and growth stage (seedling, vegetative, flowering, fruiting)?\n` +
        `• **Symptom Location**: Are lesions on older lower leaves, new growth, stems, or fruit?\n` +
        `• **Environmental Conditions**: Have you experienced prolonged cloud cover, fog, high humidity, or overhead sprinkler watering?\n\n` +
        `*Core Rule*: Always prioritize preventive cultural practices (sanitation, drip irrigation, crop rotation) over curative chemical sprays. If disease symptoms spread rapidly, bring a fresh bagged sample to your county agricultural extension office.`;
    }

    return {
      reply,
      source: 'Agricultural Knowledge Base',
      timestamp: new Date().toISOString(),
      suggestedFollowUps,
    };
  }
}

export const aiService = new AiService();
