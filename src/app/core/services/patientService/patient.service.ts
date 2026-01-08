import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Specialization, Visit, CreateVisitInput, PatientHistoryEntry, PatientInfo, UpdatePatientInfoInput } from '../../models/graphql-data.model';
import { ApolloClient } from '@apollo/client';
import { AllWeeklyAvailabilitiesResponse, DoctorData, WeeklyAvailability } from '../../models/ResponseData';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private apollo: Apollo) { }

  findAllDoctors(specialization: string): Observable<ApolloClient.QueryResult<{findAllDoctors: DoctorData[]}>> {
    const query = gql`
      query FindAllDoctors($specialization: Specialization!) {
        findAllDoctors(specialization: $specialization) {
          doctorId
          firstName
          lastName
          email
        }
      }
    `;

    return this.apollo.use('visit').query<{findAllDoctors: DoctorData[]}>({
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

  updatePatientInfo(userId: string, input: UpdatePatientInfoInput): Observable<ApolloClient.MutateResult<{ updatePatientInfo: PatientInfo }>> {
    const mutation = gql`
      mutation UpdatePatientInfo($userId: ID!, $input: UpdatePatientInfoInput!) {
        updatePatientInfo(userId: $userId, input: $input) {
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

    return this.apollo.use('patientRecord').mutate<{ updatePatientInfo: PatientInfo }>({
      mutation,
      variables: {
        userId,
        input
      }
    });
  }

  addAllergy(userId: string, allergy: string): Observable<ApolloClient.MutateResult<{ addAllergy: PatientInfo }>> {
    const mutation = gql`
      mutation AddAllergy($userId: ID!, $allergy: String!) {
        addAllergy(userId: $userId, allergy: $allergy) {
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

    return this.apollo.use('patientRecord').mutate<{ addAllergy: PatientInfo }>({
      mutation,
      variables: { userId, allergy }
    });
  }

  removeAllergy(userId: string, allergy: string): Observable<ApolloClient.MutateResult<{ removeAllergy: PatientInfo }>> {
    const mutation = gql`
      mutation RemoveAllergy($userId: ID!, $allergy: String!) {
        removeAllergy(userId: $userId, allergy: $allergy) {
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

    return this.apollo.use('patientRecord').mutate<{ removeAllergy: PatientInfo }>({
      mutation,
      variables: { userId, allergy }
    });
  }

  addChronicDisease(userId: string, disease: string): Observable<ApolloClient.MutateResult<{ addChronicDisease: PatientInfo }>> {
    const mutation = gql`
      mutation AddChronicDisease($userId: ID!, $disease: String!) {
        addChronicDisease(userId: $userId, disease: $disease) {
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

    return this.apollo.use('patientRecord').mutate<{ addChronicDisease: PatientInfo }>({
      mutation,
      variables: { userId, disease }
    });
  }

  removeChronicDisease(userId: string, disease: string): Observable<ApolloClient.MutateResult<{ removeChronicDisease: PatientInfo }>> {
    const mutation = gql`
      mutation RemoveChronicDisease($userId: ID!, $disease: String!) {
        removeChronicDisease(userId: $userId, disease: $disease) {
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

    return this.apollo.use('patientRecord').mutate<{ removeChronicDisease: PatientInfo }>({
      mutation,
      variables: { userId, disease }
    });
  }

  addMedication(userId: string, medicationId: string): Observable<ApolloClient.MutateResult<{ addMedication: PatientInfo }>> {
    const mutation = gql`
      mutation AddMedication($userId: ID!, $medicationId: ID!) {
        addMedication(userId: $userId, medicationId: $medicationId) {
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

    return this.apollo.use('patientRecord').mutate<{ addMedication: PatientInfo }>({
      mutation,
      variables: { userId, medicationId }
    });
  }
}
