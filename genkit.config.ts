import { checks, ChecksEvaluationMetricType } from '@genkit-ai/checks';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { firebaseConfig } from './src/app/infrastructure/config/firebase/firebase.config';

export const ai = genkit({
  plugins: [
    // Google AI 插件配置
    googleAI({
      apiKey: process.env['GOOGLE_GENAI_API_KEY'],
    }),

    // 安全檢查插件
    checks({
      projectId: firebaseConfig.projectId, // 直接使用Firebase项目ID
      evaluation: {
        metrics: [
          // 使用正确的枚举类型
          ChecksEvaluationMetricType.DANGEROUS_CONTENT,
          ChecksEvaluationMetricType.HARASSMENT,
          ChecksEvaluationMetricType.HATE_SPEECH,
          ChecksEvaluationMetricType.MEDICAL_INFO,
          ChecksEvaluationMetricType.OBSCENITY_AND_PROFANITY,
          ChecksEvaluationMetricType.PII_SOLICITING_RECITING,
          ChecksEvaluationMetricType.SEXUALLY_EXPLICIT,
          ChecksEvaluationMetricType.VIOLENCE_AND_GORE
        ]
      }
    })
  ],

  // 設置默認模型
  model: gemini15Flash
});

export default ai;
