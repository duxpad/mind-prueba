import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../../../../core/components/dialog/dialog.component';
import { SuperHerosContentService } from '../../services/super-heros-content.service';
import { IntHero } from './schemas/superhero.interface';

@Component({
  selector: 'app-super-hero',
  templateUrl: './super-hero.component.html',
  styleUrls: ['./super-hero.component.scss'],
})
export class SuperHeroComponent implements OnInit {
  private updateConfirmationLabel =
    'Are you sure you want to save your changes?';
  private deleteConfirmationLabel =
    'Are you sure you want to delete this Superhero?';
  superHeroes: IntHero[] = [];
  currentPage: number = 1;
  isEditing: boolean = false;
  showAddForm: boolean = false;
  heroForm: FormGroup;
  displayedColumns: string[] = ['id', 'superhero', 'actions'];
  dataSource = new MatTableDataSource(this.superHeroes);

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private superHeroesService: SuperHerosContentService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.heroForm = this.fb.group({
      id: [null],
      superhero: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          this.validateSuperheroFormat,
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loadSuperHeroes();
    this.initHeroesSubscription();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /***************/
  // SUBSCRIPTIONS
  /***************/
  private initHeroesSubscription(): void {
    this.superHeroesService.superHeroes$.subscribe((heroes: IntHero[]) => {
      this.superHeroes = heroes;
    });
  }

  /***************/
  // DATA
  /***************/
  private loadSuperHeroes(): void {
    this.superHeroes = this.superHeroesService.getAllSuperHeroes();
    this.dataSource = new MatTableDataSource(this.superHeroes);
  }

  /***************/
  // ACTIONS
  /***************/
  onAddHero(): void {
    if (this.heroForm.valid) {
      const newHero = {
        id: this.generateRandomId(),
        superhero: this.heroForm.value.superhero,
      };
      this.superHeroesService.createSuperHero(newHero);
      this.dataSource.data = this.superHeroes;
      this.paginator.lastPage();
      this.toggleAddForm();
    }
  }

  onDeleteSuperHero(hero: IntHero): void {
    const dialogRef = this.confirmationDialog(this.deleteConfirmationLabel);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.superHeroesService.deleteSuperHero(hero.id);
        this.dataSource.data = this.superHeroes;
      }
    });
  }

  onFilterHeroes(event: any) {
    this.dataSource.data = this.superHeroesService.filterSuperHeroes(
      event?.target?.value
    );
  }

  onSaveEdit(): void {
    if (this.heroForm.valid) {
      const editedHero = {
        id: this.heroForm.value.id,
        ...this.heroForm.value,
      };

      const dialogRef = this.confirmationDialog(this.updateConfirmationLabel);
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.superHeroesService.updateSuperHero(editedHero);
          this.isEditing = false;
          this.dataSource.data = this.superHeroes;
        }
      });
    }
  }

  onCancelEdit() {
    this.isEditing = false;
    this.heroForm.reset();
  }

  onEditSuperhero(hero: any) {
    this.heroForm.patchValue(hero);
    this.isEditing = true;
  }

  onPageChange(e: any) {
    this.currentPage = e.pageIndex;
  }

  /***************/
  // AUX
  /***************/
  private generateRandomId(): string {
    return Math.floor(Math.random() * 1000).toString();
  }

  private validateSuperheroFormat(control: any) {
    const superhero = control.value;
    const pattern = /^(?!^\s+$)[A-Za-z\s\-]+$/;
    if (!pattern.test(superhero)) {
      return { invalidFormat: true };
    }
    return null;
  }

  private confirmationDialog(message: string): any {
    return this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmation',
        message: message,
      },
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.heroForm.reset();
    }
  }
}
