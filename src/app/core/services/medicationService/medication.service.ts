import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ApolloClient } from '@apollo/client';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Observable } from 'rxjs';
import { Medication, MedicationFilterInput, CreateMedicationInput, PatchMedicationInput, IngredientInput, UpdateIngredientInput, DrugInteraction } from '../../models/MedicationData';

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private apolloClientName = 'medication';

  constructor(private apollo: Apollo) {}

  medications(filter?: MedicationFilterInput, limit: number = 20, offset: number = 0): Observable<ApolloClient.QueryResult<{ medications: Medication[] }>> {
    const query: TypedDocumentNode<{ medications: Medication[] }, { filter?: MedicationFilterInput; limit?: number; offset?: number }> = gql`
      query Medications($filter: MedicationFilterInput, $limit: Int, $offset: Int) {
        medications(filter: $filter, limit: $limit, offset: $offset) {
          id
          ean
          atcCode
          tradeName
          genericName
          manufacturer
          form
          route
          packageSize
          requiresPrescription
          ingredients { id name strength isActive }
          indications
          sideEffects
        }
      }
    `;

    return this.apollo.use(this.apolloClientName).query({
      query,
      variables: { filter, limit, offset },
    });
  }

  medication(id: string): Observable<ApolloClient.QueryResult<{ medication: Medication }>> {
    const query: TypedDocumentNode<{ medication: Medication }, { id: string }> = gql`
      query Medication($id: ID!) {
        medication(id: $id) {
          id
          ean
          atcCode
          tradeName
          genericName
          manufacturer
          form
          route
          packageSize
          requiresPrescription
          ingredients { id name strength isActive }
          indications
          sideEffects
        }
      }
    `;

    return this.apollo.use(this.apolloClientName).query({ query, variables: { id } });
  }

  createMedication(input: CreateMedicationInput): Observable<ApolloClient.MutateResult<{ createMedication: Medication }>> {
    const mutation: TypedDocumentNode<{ createMedication: Medication }, { input: CreateMedicationInput }> = gql`
      mutation CreateMedication($input: CreateMedicationInput!) {
        createMedication(input: $input) {
          id
          ean
          atcCode
          tradeName
          genericName
          manufacturer
          form
          route
          packageSize
          requiresPrescription
          ingredients { id name strength isActive }
          indications
          sideEffects
        }
      }
    `;

    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { input } });
  }

  patchMedication(id: string, input: PatchMedicationInput): Observable<ApolloClient.MutateResult<{ patchMedication: Medication }>> {
    const mutation: TypedDocumentNode<{ patchMedication: Medication }, { id: string; input: PatchMedicationInput }> = gql`
      mutation PatchMedication($id: ID!, $input: PatchMedicationInput!) {
        patchMedication(id: $id, input: $input) {
          id
          ean
          atcCode
          tradeName
          genericName
          manufacturer
          form
          route
          packageSize
          requiresPrescription
          ingredients { id name strength isActive }
          indications
          sideEffects
        }
      }
    `;

    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { id, input } });
  }

  deleteMedication(id: string): Observable<ApolloClient.MutateResult<{ deleteMedication: boolean }>> {
    const mutation: TypedDocumentNode<{ deleteMedication: boolean }, { id: string }> = gql`
      mutation DeleteMedication($id: ID!) {
        deleteMedication(id: $id)
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { id } });
  }

  addIngredient(medicationId: string, input: IngredientInput): Observable<ApolloClient.MutateResult<{ addIngredient: Medication }>> {
    const mutation: TypedDocumentNode<{ addIngredient: Medication }, { medicationId: string; input: IngredientInput }> = gql`
      mutation AddIngredient($medicationId: ID!, $input: IngredientInput!) {
        addIngredient(medicationId: $medicationId, input: $input) {
          id
          ingredients { id name strength isActive }
        }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, input } });
  }

  updateIngredient(medicationId: string, ingredientId: string, input: UpdateIngredientInput): Observable<ApolloClient.MutateResult<{ updateIngredient: Medication }>> {
    const mutation: TypedDocumentNode<{ updateIngredient: Medication }, { medicationId: string; ingredientId: string; input: UpdateIngredientInput }> = gql`
      mutation UpdateIngredient($medicationId: ID!, $ingredientId: ID!, $input: UpdateIngredientInput!) {
        updateIngredient(medicationId: $medicationId, ingredientId: $ingredientId, input: $input) {
          id
          ingredients { id name strength isActive }
        }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, ingredientId, input } });
  }

  removeIngredient(medicationId: string, ingredientId: string): Observable<ApolloClient.MutateResult<{ removeIngredient: Medication }>> {
    const mutation: TypedDocumentNode<{ removeIngredient: Medication }, { medicationId: string; ingredientId: string }> = gql`
      mutation RemoveIngredient($medicationId: ID!, $ingredientId: ID!) {
        removeIngredient(medicationId: $medicationId, ingredientId: $ingredientId) {
          id
          ingredients { id name strength isActive }
        }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, ingredientId } });
  }

  addIndication(medicationId: string, indication: string): Observable<ApolloClient.MutateResult<{ addIndication: Medication }>> {
    const mutation: TypedDocumentNode<{ addIndication: Medication }, { medicationId: string; indication: string }> = gql`
      mutation AddIndication($medicationId: ID!, $indication: String!) {
        addIndication(medicationId: $medicationId, indication: $indication) { id indications }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, indication } });
  }

  removeIndication(medicationId: string, indication: string): Observable<ApolloClient.MutateResult<{ removeIndication: Medication }>> {
    const mutation: TypedDocumentNode<{ removeIndication: Medication }, { medicationId: string; indication: string }> = gql`
      mutation RemoveIndication($medicationId: ID!, $indication: String!) {
        removeIndication(medicationId: $medicationId, indication: $indication) { id indications }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, indication } });
  }

  addSideEffect(medicationId: string, sideEffect: string): Observable<ApolloClient.MutateResult<{ addSideEffect: Medication }>> {
    const mutation: TypedDocumentNode<{ addSideEffect: Medication }, { medicationId: string; sideEffect: string }> = gql`
      mutation AddSideEffect($medicationId: ID!, $sideEffect: String!) {
        addSideEffect(medicationId: $medicationId, sideEffect: $sideEffect) { id sideEffects }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, sideEffect } });
  }

  removeSideEffect(medicationId: string, sideEffect: string): Observable<ApolloClient.MutateResult<{ removeSideEffect: Medication }>> {
    const mutation: TypedDocumentNode<{ removeSideEffect: Medication }, { medicationId: string; sideEffect: string }> = gql`
      mutation RemoveSideEffect($medicationId: ID!, $sideEffect: String!) {
        removeSideEffect(medicationId: $medicationId, sideEffect: $sideEffect) { id sideEffects }
      }
    `;
    return this.apollo.use(this.apolloClientName).mutate({ mutation, variables: { medicationId, sideEffect } });
  }

  checkInteractions(targetMedicationId: string, currentMedicationIds: string[]): Observable<ApolloClient.QueryResult<{ checkInteractions: DrugInteraction[] }>> {
    const query: TypedDocumentNode<{ checkInteractions: DrugInteraction[] }, { targetMedicationId: string; currentMedicationIds: string[] }> = gql`
      query CheckInteractions($targetMedicationId: ID!, $currentMedicationIds: [ID!]!) {
        checkInteractions(targetMedicationId: $targetMedicationId, currentMedicationIds: $currentMedicationIds) {
          targetMedicationId
          riskLevel
          effect
        }
      }
    `;
    return this.apollo.use(this.apolloClientName).query({ query, variables: { targetMedicationId, currentMedicationIds } });
  }
}
