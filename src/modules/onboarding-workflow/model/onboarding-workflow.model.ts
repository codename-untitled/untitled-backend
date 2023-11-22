import { Schema, model } from 'mongoose';

export interface OnboardingStepInfo {
  step: Schema.Types.ObjectId;
  order: number;
}

export interface OnboardingWorkflow {
  companyId?: string;
  title: string;
  overview: string;
  steps: OnboardingStepInfo[];
}

class OnboardingWorkflowModel {
  private static schema: Schema = new Schema(
    {
      companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      overview: {
        type: String,
        required: true,
      },
      steps: [
        {
          step: {
            type: Schema.Types.ObjectId,
            ref: 'OnboardingStep',
            required: true,
          },
          order: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    { timestamps: true },
  );

  static getModel() {
    return model<OnboardingWorkflow>('OnboardingWorkflow', this.schema);
  }
}

export default OnboardingWorkflowModel;
