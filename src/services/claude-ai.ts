import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

interface PatientAnalysis {
  riskFactors: string[];
  recommendations: string[];
  treatmentPriority: 'low' | 'medium' | 'high';
  followUpNeeded: boolean;
}

interface TreatmentSuggestion {
  treatment: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedCost: string;
  duration: string;
  description: string;
}

export async function analyzePatientData(patientData: {
  symptoms: string;
  medicalHistory: string;
  age: number;
  lastVisit?: string;
}): Promise<PatientAnalysis | null> {
  if (!process.env.CLAUDE_API_KEY) {
    console.warn('Claude API key not configured');
    return null;
  }

  try {
    const prompt = `As a dental AI assistant, analyze this patient data and provide recommendations:

Patient Information:
- Age: ${patientData.age}
- Symptoms: ${patientData.symptoms}
- Medical History: ${patientData.medicalHistory}
- Last Visit: ${patientData.lastVisit || 'First visit'}

Please provide:
1. Risk factors (array of strings)
2. Treatment recommendations (array of strings)
3. Treatment priority (low/medium/high)
4. Whether follow-up is needed (boolean)

Respond in JSON format only.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    
    return null;
  } catch (error) {
    console.error('Claude AI analysis failed:', error);
    return null;
  }
}

export async function suggestTreatmentPlan(symptoms: string, budget?: number): Promise<TreatmentSuggestion[]> {
  if (!process.env.CLAUDE_API_KEY) {
    return [];
  }

  try {
    const prompt = `As a dental AI assistant, suggest treatment options for these symptoms: "${symptoms}"
    ${budget ? `Patient budget: ₹${budget}` : ''}
    
    Provide 2-3 treatment suggestions with:
    - treatment name
    - urgency (low/medium/high)
    - estimatedCost (in ₹)
    - duration
    - description
    
    Respond in JSON array format.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    
    return [];
  } catch (error) {
    console.error('Treatment suggestion failed:', error);
    return [];
  }
}

export async function generatePatientReport(patientData: any): Promise<string | null> {
  if (!process.env.CLAUDE_API_KEY) {
    return null;
  }

  try {
    const prompt = `Generate a comprehensive dental patient report for:

Patient: ${patientData.name}
Age: ${patientData.age}
Recent Treatments: ${patientData.treatments?.map((t: any) => t.name).join(', ') || 'None'}
Current Medications: ${patientData.medications?.map((m: any) => m.name).join(', ') || 'None'}
Allergies: ${patientData.allergies?.join(', ') || 'None'}
Last Visit: ${patientData.lastVisit || 'First visit'}

Create a professional medical report with:
1. Patient summary
2. Treatment history
3. Current status
4. Recommendations
5. Next steps

Format as a professional medical document.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    return null;
  } catch (error) {
    console.error('Report generation failed:', error);
    return null;
  }
}