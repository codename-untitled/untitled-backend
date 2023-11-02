import { Inject, Injectable } from '@nestjs/common';
import { CreateStepDto } from '../dtos/CreateStepDto';
import { OnboardingStepsRepo } from '../repository/onboarding-steps.repository';
import { InjectionTokens } from 'src/libs/common/types/enum';
import { UploadDocumentRepo } from 'src/modules/steps-configuration/repository/upload-document.repository';
import { SignedDocumentRepo } from 'src/modules/steps-configuration/repository/signed-document.repository';
import { FirebaseStorage } from 'src/libs/infra/firebase-storage/firebase-storage';
import { CreateSignDocumentStepDto } from '../dtos/CreateSignedDocumentStepDto';
import { CheckListRepo } from 'src/modules/steps-configuration/repository/checklist.repository';

@Injectable()
export class OnboardingStepsService {
  
  @Inject(InjectionTokens.UploadDocumentRepo)
  private readonly uploadDocumentRepo: UploadDocumentRepo;

  @Inject(InjectionTokens.SignDocumentRepo)
  private readonly signDocumentRepo: SignedDocumentRepo;

  @Inject(InjectionTokens.CheckListRepo)
  private readonly checkListRepo: CheckListRepo;

  constructor(@Inject(InjectionTokens.OnboardingStepsRepo)private readonly onboardingStepsRepo: OnboardingStepsRepo) {}

  async createStep(dto: CreateStepDto) {
    try {
      let step
  
      if(dto.type === 'UploadDocument'){
        const newUploadDocument = await this.uploadDocumentRepo.save(dto.data);
        step = {
          type: dto.type,
          data: newUploadDocument._id,
        };
      }

      if(dto.type === 'CheckList'){
        const newCheckList = await this.checkListRepo.save(dto.data);
        step = {
          type: dto.type,
          data: newCheckList._id,
        };

      }

      return this.onboardingStepsRepo.save(step);
    } catch (error) {
      console.log(error);
    }

  }

  async updateStep(id: string, dto: CreateStepDto) {
    try {
      if(dto.type === 'UploadDocument'){
        console.log(id);
        const documentStep =  await this.onboardingStepsRepo.findById(id);
        return this.uploadDocumentRepo.findOneAndUpdate({ _id: documentStep.data }, dto.data);
      }

      if(dto.type === 'CheckList'){
        const documentStep =  await this.onboardingStepsRepo.findById(id);
        return this.checkListRepo.findOneAndUpdate({ _id: documentStep.data }, dto.data); 
      }

      return

    } catch (error) {
      console.log(error);
    }
  }

  async createSignDocumentStep(docs: Express.Multer.File[], dto: CreateSignDocumentStepDto) {
    try {
      const documentDetails =  await FirebaseStorage.uploadFiles(docs);
      const newSignDocumentData = {
        ...dto,
        documents: documentDetails,
      }
      const step = await this.signDocumentRepo.save(newSignDocumentData);

      return this.onboardingStepsRepo.save({
        type: 'SignDocument',
        data: step._id,
      });

      
    } catch (error) {
      console.log(error);
    }

  }

  async getAllSteps(): Promise<any> {
    const steps = await this.onboardingStepsRepo.findPaginated(10, 1, {}, 'data');
    return steps;
  }

//   async getWorkflowById(id: string): Promise<OnboardingWorkflow | null> {
//     const workflow = await this.onboardingWorkflowRepo.findOne(id);
//     return workflow;
//   }

  // async getAllWorkflows(): Promise<any> {
  //   const workflows = await this.onboardingWorkflowRepo.findPaginated();
  //   console.log(workflows);
  //   return workflows;
  // }

//   async updateWorkflow(id: string, title: string, overview: string): Promise<OnboardingWorkflow | null> {
//     const updatedWorkflow = await this.onboardingWorkflowRepo.findOneAndUpdate(
//       { id }, // Assuming you have an id field
//       { title, overview }
//     );
//     return updatedWorkflow;
//   }

//   async deleteWorkflow(id: string): Promise<{ success: boolean }> {
//     const deleteResult = await this.onboardingWorkflowRepo.findOneAndDelete({ id });
//     return { success: deleteResult.status };
//   }
}
