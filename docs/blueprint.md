# **App Name**: AgriAssist

## Core Features:

- Crop Recommendation: Recommend the top 3 most suitable crops based on input parameters (N, P, K, Temperature, Humidity, pH, Rainfall) using a pre-trained ML model.
- Fertilizer Recommendation: Recommend suitable fertilizers for a selected crop based on input parameters (N, P, K, Temperature, Humidity, pH, Rainfall) using a pre-trained ML model and dosage instructions.
- Input Form: Provide a user interface for entering crop details and environmental parameters, ensuring data validation.
- Recommendation Display: Display the top 3 recommended crops with suitability scores and fertilizer recommendations with dosage instructions in a clear, tabular format, including suitable charts.
- API Endpoint Integration: Integrate with /predict-crop and /predict-fertilizer API endpoints to fetch predictions from pre-trained ML models.
- Data Persistence: This feature involves reasoning, so this will make use of the tool where data that users will need on hand frequently can be persisted, such as favorite plants

## Style Guidelines:

- Primary color: Earthy green (#6B8E23) to reflect agriculture and nature.
- Background color: Light beige (#F5F5DC) to provide a neutral, calming backdrop.
- Accent color: Warm brown (#A0522D) for highlights and CTAs, complementing the earthy tones.
- Body and headline font: 'PT Sans', a humanist sans-serif that combines a modern look and a little warmth or personality. This font is appropriate for both headlines and body text.
- Use agriculture-themed icons for crops, fertilizers, and environmental parameters.
- Implement a responsive design with clear sections for input forms and results display.
- Subtle transitions when displaying recommendations to enhance user experience.