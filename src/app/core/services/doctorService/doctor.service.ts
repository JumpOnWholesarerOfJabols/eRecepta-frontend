import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateWeeklyAvailabilityInput, Specialization, Visit, VisitStatus } from '../../models/graphql-data.model';
import { AllWeeklyAvailabilitiesResponse } from '../../models/ResponseData';
import { AuthService } from '../../auth/services/authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private apollo: Apollo, private authService: AuthService) { }

  createWeeklyAvailability(waInput: CreateWeeklyAvailabilityInput) {
    const mutation = gql`
      mutation createWeeklyAvailability($input: CreateWeeklyAvailabilityInput!) {
        createWeeklyAvailability(waInput: $input)
      }
    `;

    return this.apollo.use('visit').mutate<{ createWeeklyAvailability: boolean }>({
      mutation: mutation,
      variables: {
        input: waInput
      }
    })
  }

  findAllWeeklyAvailabilities(doctorId: string) {
    const query = gql`
      query FindAllWeeklyAvailabilities($doctorId: String!) {
        findAllWeeklyAvailabilities(doctorId: $doctorId) {
          doctorId
          dayOfWeek
          startTime
          endTime
        }
      }
    `;

    return this.apollo.use('visit').query<AllWeeklyAvailabilitiesResponse>({
      query,
      variables: {
        doctorId
      }
    })
  }

  completeVisit(visitId: string, newVisitStatus: VisitStatus) {
    const mutation = gql`
      mutation UpdateVisitStatus($visitId: String!, $newVisitStatus: VisitStatus!) {
        updateVisitStatus(visitId: $visitId, newVisitStatus: $newVisitStatus)
      }
    `;

    return this.apollo.use('visit').mutate<{ updateVisitStatus: boolean }>({
      mutation,
      variables: {
        visitId,
        newVisitStatus,
      },
    });
  }

  getAppointments() {
      const query = gql`
        query FindAllVisits {
          findAllVisits {
            id
            doctorId
            patientId
            specialization
            visitTime
            visitStatus
          }
        }
      `;
  
      return this.apollo.use('visit').query<{ findAllVisits: Visit[] }>({ query });
    }

  cancelVisit(input: string) {
    const mutation = gql`
      mutation CancelVisit($input: String!) {
        cancelVisit(visitId: $input)
      }
    `;
    
    return this.apollo.use('visit').mutate<{cancelVisit: boolean}>({
      mutation, 
      variables: {
        input
      }
    })
  }

  findAllSpecializations() {
    const query = gql`
      query FindAllSpecializations($doctorId: String!) {
        findAllSpecializations(doctorId: $doctorId)
      }
    `

    return this.apollo.use('visit').query<{ findAllSpecializations: Specialization[] }>({
      query,
      variables: {
        doctorId: this.authService.getUserId(),
      }
    })
  }

  createSpecialization(specialization: Specialization) {
    const mutation = gql`
      mutation CreateSpecialization($specialization: Specialization!) {
        createSpecialization(specialization: $specialization)
      }
    `;

    return this.apollo.use('visit').mutate<{ createSpecialization: boolean }>({
      mutation,
      variables: { specialization },
    });
  }

  deleteSpecialization(specialization: Specialization) {
    const mutation = gql`
      mutation DeleteSpecialization($specialization: Specialization!) {
        deleteSpecialization(specialization: $specialization)
      }
    `;

    return this.apollo.use('visit').mutate<{ deleteSpecialization: boolean }>({
      mutation,
      variables: { specialization },
    });
  }

  deleteWeeklyAvailability(dow: string) {
    const mutation = gql`
      mutation DeleteWeeklyAvailability($dow: DayOfWeek!) {
        deleteWeeklyAvailability(dow: $dow)
      }
    `;

    return this.apollo.use('visit').mutate<{ deleteWeeklyAvailability: boolean }>({
      mutation,
      variables: { dow },
    });
  }
}
