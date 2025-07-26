# Claude AI Integration Setup

## Quick Setup

1. **Get Claude API Key**:
   - Go to https://console.anthropic.com/
   - Create account and get API key
   - Add to `.env.local`: `CLAUDE_API_KEY=your-actual-key`

2. **Install Dependencies**:
   ```bash
   npm install @anthropic-ai/sdk
   ```

3. **Features Available**:
   - **Patient Symptom Analysis**: AI analyzes symptoms and suggests treatments
   - **Risk Assessment**: Identifies potential dental health risks
   - **Treatment Recommendations**: AI-powered treatment suggestions
   - **Report Generation**: Automated patient reports

## AI Assistant Features

### 1. Symptom Analysis
- Input patient symptoms
- Get AI-powered risk assessment
- Receive treatment priority (low/medium/high)
- Get follow-up recommendations

### 2. Treatment Suggestions
- AI suggests appropriate treatments
- Cost estimates and duration
- Urgency levels
- Detailed descriptions

### 3. Report Generation
- Comprehensive AI analysis reports
- Professional medical format
- Downloadable PDF/text format
- Integration with patient records

## Demo Mode
Without API key, the system runs in demo mode with simulated responses.

## Usage in Admin Dashboard
1. Navigate to admin dashboard
2. Find "AI Dental Assistant" section
3. Enter patient symptoms
4. Click "Analyze Symptoms"
5. Review AI recommendations
6. Download analysis report

The AI assistant helps doctors make informed decisions and provides second opinions on treatment plans.