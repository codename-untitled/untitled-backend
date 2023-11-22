import { OnboardingWorkflowDomain } from '../domain/onboarding-workflow';
import { OnboardingWorkflow } from '../model/onboarding-workflow.model';

export class OnboardingWorkflowMap {
  public static toPersistence(
    onboardingWorkflow: OnboardingWorkflowDomain,
  ): OnboardingWorkflow {
    return {
      companyId: onboardingWorkflow.companyId,
      title: onboardingWorkflow.title,
      overview: onboardingWorkflow.overview,
      steps: onboardingWorkflow.steps,
    };
  }
}
