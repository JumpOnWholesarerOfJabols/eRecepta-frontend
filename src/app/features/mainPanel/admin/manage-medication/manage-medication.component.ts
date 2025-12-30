import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { finalize } from 'rxjs/operators';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { MedicationService } from '../../../../core/services/medicationService/medication.service';
import { Medication, MedicationForm, RouteOfAdministration, IngredientInput, CreateMedicationInput, PatchMedicationInput } from '../../../../core/models/MedicationData';

@Component({
  selector: 'app-manage-medication',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './manage-medication.component.html',
  styleUrls: []
})
export class ManageMedicationComponent implements OnInit {
  loading = false;
  creating = false;
  updating = false;
  deleting = false;

  medications: Medication[] = [];
  selected: Medication | null = null;

  search = '';

  createForm!: FormGroup;
  patchForm!: FormGroup;

  readonly forms = Object.values(MedicationForm);
  readonly routes = Object.values(RouteOfAdministration);

  ingredientsDraft: IngredientInput[] = [];
  indicationsDraft: string[] = [];
  sideEffectsDraft: string[] = [];

  // selected medication editors
  selectedIngredientName = '';
  selectedIngredientStrength = '';
  selectedIngredientActive = true;
  selectedIndicationText = '';
  selectedSideEffectText = '';

  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private medicationService: MedicationService
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      ean: ['', Validators.required],
      atcCode: ['', Validators.required],
      tradeName: ['', Validators.required],
      genericName: ['', Validators.required],
      manufacturer: ['', Validators.required],
      form: [null, Validators.required],
      route: [null, Validators.required],
      packageSize: ['', Validators.required],
      requiresPrescription: [false, Validators.required],
      ingredientName: [''],
      ingredientStrength: [''],
      ingredientActive: [true],
      indicationText: [''],
      sideEffectText: [''],
    });

    this.patchForm = this.fb.group({
      ean: [''],
      atcCode: [''],
      tradeName: [''],
      genericName: [''],
      manufacturer: [''],
      form: [null],
      route: [null],
      packageSize: [''],
      requiresPrescription: [null],
    });

    this.loadMedications();
  }

  loadMedications() {
    this.loading = true;
    this.medicationService
      .medications(this.search ? { search: this.search } : undefined, 50, 0)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.medications = result.data?.medications ?? [];
        },
      });
  }

  selectMedication(med: Medication) {
    this.selected = med;
    this.patchForm.reset({
      ean: med.ean ?? '',
      atcCode: med.atcCode ?? '',
      tradeName: med.tradeName,
      genericName: med.genericName,
      manufacturer: med.manufacturer,
      form: med.form,
      route: med.route,
      packageSize: med.packageSize,
      requiresPrescription: med.requiresPrescription,
    });
    // reset inline editors
    this.selectedIngredientName = '';
    this.selectedIngredientStrength = '';
    this.selectedIngredientActive = true;
    this.selectedIndicationText = '';
    this.selectedSideEffectText = '';
  }

  addIngredientDraft() {
    const name = this.createForm.get('ingredientName')!.value?.trim();
    const strength = this.createForm.get('ingredientStrength')!.value?.trim();
    const isActive = !!this.createForm.get('ingredientActive')!.value;
    if (!name || !strength) return;
    this.ingredientsDraft = [...this.ingredientsDraft, { name, strength, isActive }];
    this.createForm.patchValue({ ingredientName: '', ingredientStrength: '' });
  }

  removeIngredientDraft(i: number) {
    this.ingredientsDraft = this.ingredientsDraft.filter((_, idx) => idx !== i);
  }

  addIndicationDraft() {
    const text = this.createForm.get('indicationText')!.value?.trim();
    if (!text) return;
    this.indicationsDraft = [...this.indicationsDraft, text];
    this.createForm.patchValue({ indicationText: '' });
  }

  removeIndicationDraft(i: number) {
    this.indicationsDraft = this.indicationsDraft.filter((_, idx) => idx !== i);
  }

  addSideEffectDraft() {
    const text = this.createForm.get('sideEffectText')!.value?.trim();
    if (!text) return;
    this.sideEffectsDraft = [...this.sideEffectsDraft, text];
    this.createForm.patchValue({ sideEffectText: '' });
  }

  removeSideEffectDraft(i: number) {
    this.sideEffectsDraft = this.sideEffectsDraft.filter((_, idx) => idx !== i);
  }

  createMedication() {
    if (this.creating || this.createForm.invalid) return;
    const value = this.createForm.getRawValue();

    const input: CreateMedicationInput = {
      ean: value.ean,
      atcCode: value.atcCode,
      tradeName: value.tradeName,
      genericName: value.genericName,
      manufacturer: value.manufacturer,
      form: value.form,
      route: value.route,
      packageSize: value.packageSize,
      requiresPrescription: !!value.requiresPrescription,
      ingredients: this.ingredientsDraft.length ? this.ingredientsDraft : undefined,
      indications: this.indicationsDraft.length ? this.indicationsDraft : undefined,
      sideEffects: this.sideEffectsDraft.length ? this.sideEffectsDraft : undefined,
    };

    this.creating = true;
    this.medicationService
      .createMedication(input)
      .pipe(finalize(() => (this.creating = false)))
      .subscribe({
        next: (result) => {
          const created = result.data?.createMedication;
          if (created) {
            this.snackbar.openSnackBar('Medication created');
            this.medications = [created, ...this.medications];
            this.createForm.reset({ requiresPrescription: false, ingredientActive: true });
            this.ingredientsDraft = [];
            this.indicationsDraft = [];
            this.sideEffectsDraft = [];
          }
        },
      });
  }

  patchMedication() {
    if (!this.selected || this.updating) return;
    const value = this.patchForm.getRawValue();
    const input: PatchMedicationInput = {
      ean: value.ean || undefined,
      atcCode: value.atcCode || undefined,
      tradeName: value.tradeName || undefined,
      genericName: value.genericName || undefined,
      manufacturer: value.manufacturer || undefined,
      form: value.form || undefined,
      route: value.route || undefined,
      packageSize: value.packageSize || undefined,
      requiresPrescription: value.requiresPrescription ?? undefined,
    };

    this.updating = true;
    this.medicationService
      .patchMedication(this.selected.id, input)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.patchMedication;
          if (updated) {
            this.snackbar.openSnackBar('Medication updated');
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.selected = updated;
          }
        },
      });
  }

  deleteMedication() {
    if (!this.selected || this.deleting) return;
    this.deleting = true;
    this.medicationService
      .deleteMedication(this.selected.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe({
        next: (result) => {
          if (result.data?.deleteMedication) {
            this.snackbar.openSnackBar('Medication deleted');
            this.medications = this.medications.filter((m) => m.id !== this.selected!.id);
            this.selected = null;
          }
        },
      });
  }

  addSelectedIngredient() {
    if (!this.selected) return;
    const name = this.selectedIngredientName.trim();
    const strength = this.selectedIngredientStrength.trim();
    const isActive = !!this.selectedIngredientActive;
    if (!name || !strength) return;
    const input: IngredientInput = { name, strength, isActive };
    this.updating = true;
    this.medicationService
      .addIngredient(this.selected.id, input)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.addIngredient;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.selectedIngredientName = '';
            this.selectedIngredientStrength = '';
            this.selectedIngredientActive = true;
            this.snackbar.openSnackBar('Ingredient added');
          }
        },
      });
  }

  removeSelectedIngredient(ingredientId: string) {
    if (!this.selected) return;
    this.updating = true;
    this.medicationService
      .removeIngredient(this.selected.id, ingredientId)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.removeIngredient;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.snackbar.openSnackBar('Ingredient removed');
          }
        },
      });
  }

  addSelectedIndication() {
    if (!this.selected) return;
    const text = this.selectedIndicationText.trim();
    if (!text) return;
    this.updating = true;
    this.medicationService
      .addIndication(this.selected.id, text)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.addIndication;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.selectedIndicationText = '';
            this.snackbar.openSnackBar('Indication added');
          }
        },
      });
  }

  removeSelectedIndication(indication: string) {
    if (!this.selected) return;
    this.updating = true;
    this.medicationService
      .removeIndication(this.selected.id, indication)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.removeIndication;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.snackbar.openSnackBar('Indication removed');
          }
        },
      });
  }

  addSelectedSideEffect() {
    if (!this.selected) return;
    const text = this.selectedSideEffectText.trim();
    if (!text) return;
    this.updating = true;
    this.medicationService
      .addSideEffect(this.selected.id, text)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.addSideEffect;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.selectedSideEffectText = '';
            this.snackbar.openSnackBar('Side effect added');
          }
        },
      });
  }

  removeSelectedSideEffect(sideEffect: string) {
    if (!this.selected) return;
    this.updating = true;
    this.medicationService
      .removeSideEffect(this.selected.id, sideEffect)
      .pipe(finalize(() => (this.updating = false)))
      .subscribe({
        next: (result) => {
          const updated = result.data?.removeSideEffect;
          if (updated) {
            this.selected = updated;
            this.medications = this.medications.map((m) => (m.id === updated.id ? updated : m));
            this.snackbar.openSnackBar('Side effect removed');
          }
        },
      });
  }
}
