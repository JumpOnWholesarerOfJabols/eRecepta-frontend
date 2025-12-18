import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Specialization, Visit, CreateVisitInput, PatientHistoryEntry, PatientInfo } from '../../models/graphql-data.model';
import { ApolloClient } from '@apollo/client';
import { AllWeeklyAvailabilitiesResponse, WeeklyAvailability } from '../../auth/models/ResponseData';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private apollo: Apollo) { }

  findAllDoctors(specialization: string): Observable<ApolloClient.QueryResult<{findAllDoctors: string[]}>> {
    const query = gql`
      query FindAllDoctors($specialization: Specialization!) {
        findAllDoctors(specialization: $specialization)
      }
    `;

    return this.apollo.use('visit').query<{findAllDoctors: string[]}>({
      query,
      variables: {
        specialization
      }
    });
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

  createVisit(input: CreateVisitInput) {
    const mutation = gql`
      mutation CreateVisit($input: CreateVisitInput!) {
        createVisit(visitInput: $input)
      }
    `;

    return this.apollo.use('visit').mutate<{createVisit: string}>({
      mutation,
      variables: {
        input
      }
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

  getPatientRecord(userId: string): Observable<ApolloClient.QueryResult<{ getPatientRecordByUserId: PatientInfo }>> {
    const query = gql`
      query GetPatientRecordByUserId($userId: ID!) {
        getPatientRecordByUserId(userId: $userId) {
          userId
          bloodType
          height
          weight
          allergies
          chronicDiseases
          medications
          emergencyContact
        }
      }
    `;

    return this.apollo.use('patientRecord').query<{ getPatientRecordByUserId: PatientInfo }>({
      query,
      variables: {
        userId
      }
    });
  }
}
