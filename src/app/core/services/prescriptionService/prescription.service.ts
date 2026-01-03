import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  Prescription,
  PrescriptionStatus,
  IssuePrescriptionInput,
  FulfillPrescriptionInput,
  FulfillResult,
} from '../../models/graphql-data.model';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  constructor(private apollo: Apollo) {}

  /**
   * Issue a new prescription
   */
  issuePrescription(input: IssuePrescriptionInput) {
    const mutation = gql`
      mutation IssuePrescription($input: IssuePrescriptionInput!) {
        issuePrescription(input: $input) {
          id
          createdAt
          expiresAt
          accessCode
          status
          doctorId
          patientId
          medicationId
          totalPackages
          filledPackages
          remainingPackages
        }
      }
    `;

    return this.apollo.use('prescriptions').mutate<{ issuePrescription: Prescription }>({
      mutation,
      variables: { input },
    });
  }

  /**
   * Get prescriptions with optional filters
   */
  getPrescriptions(
    patientId: string,
    status?: PrescriptionStatus,
    limit?: number,
    offset?: number
  ) {
    const query = gql`
      query Prescriptions(
        $patientId: ID!
        $status: PrescriptionStatus
        $limit: Int
        $offset: Int
      ) {
        prescriptions(
          patientId: $patientId
          status: $status
          limit: $limit
          offset: $offset
        ) {
          id
          createdAt
          expiresAt
          accessCode
          status
          doctorId
          patientId
          medicationId
          totalPackages
          filledPackages
          remainingPackages
        }
      }
    `;

    return this.apollo.use('prescriptions').query<{ prescriptions: Prescription[] }>({
      query,
      variables: {
        patientId,
        status,
        limit,
        offset,
      },
      fetchPolicy: 'network-only',
    });
  }

  /**
   * Cancel a prescription
   */
  cancelPrescription(prescriptionId: string, reason: string): Observable<any> {
    const mutation = gql`
      mutation CancelPrescription($prescriptionId: ID!, $reason: String!) {
        cancelPrescription(prescriptionId: $prescriptionId, reason: $reason) {
          id
          createdAt
          expiresAt
          accessCode
          status
          doctorId
          patientId
          medicationId
          totalPackages
          filledPackages
          remainingPackages
        }
      }
    `;

    return this.apollo.use('prescriptions').mutate<{ cancelPrescription: Prescription }>({
      mutation,
      variables: { prescriptionId, reason },
    });
  }

  /**
   * Verify a prescription (for pharmacists)
   */
  verifyPrescription(accessCode: string, patientIdentifier: string) {
    const query = gql`
      query VerifyPrescription($accessCode: String!, $patientIdentifier: String!) {
        verifyPrescription(accessCode: $accessCode, patientIdentifier: $patientIdentifier) {
          id
          createdAt
          expiresAt
          accessCode
          status
          doctorId
          patientId
          medicationId
          totalPackages
          filledPackages
          remainingPackages
        }
      }
    `;

    return this.apollo.use('prescriptions').query<{ verifyPrescription: Prescription }>({
      query,
      variables: { accessCode, patientIdentifier },
      fetchPolicy: 'network-only',
    });
  }

  /**
   * Fulfill a prescription (for pharmacists)
   */
  fulfillPrescription(input: FulfillPrescriptionInput) {
    const mutation = gql`
      mutation FulfillPrescription($input: FulfillPrescriptionInput!) {
        fulfillPrescription(input: $input) {
          updatedPrescription {
            id
            createdAt
            expiresAt
            accessCode
            status
            doctorId
            patientId
            medicationId
            totalPackages
            filledPackages
            remainingPackages
          }
          isFullyCompleted
        }
      }
    `;

    return this.apollo.use('prescriptions').mutate<{ fulfillPrescription: FulfillResult }>({
      mutation,
      variables: { input },
    });
  }
}
