import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import superHerosMock from '../../../../assets/mocks/superheros-data.json';
import { IntHero } from '../components/super-hero/schemas/superhero.interface';

@Injectable({
  providedIn: 'root',
})
export class SuperHerosContentService {
  private superHeroes: BehaviorSubject<any[]> = new BehaviorSubject<IntHero[]>(superHerosMock);
  public superHeroes$: Observable<any[]> = this.superHeroes.asObservable();

  /* CREATE SUPERHERO */
  createSuperHero(superHero: any): void {
    const updatedHeroes = [...this.superHeroes.value, superHero];
    this.superHeroes.next(updatedHeroes);
  }

  /* GET ALL SUPER HEROES */
  getAllSuperHeroes(): any {
    return this.superHeroes.value;
  }

  /* GET SUPER HERO BY ID */
  getSuperHeroById(id: string): IntHero {
    return this.superHeroes.value.find((hero: IntHero) => hero.id === id);
  }

  /* FILTER SUPERHEROES BY NAME */
  filterSuperHeroes(superhero: string): any {
    return this.superHeroes.value.filter((hero: IntHero) =>
      hero.superhero.toLowerCase().includes(superhero.toLowerCase())
    );
  }

  /* UPDATE SUPERHERO */
  updateSuperHero(newSuperHero: IntHero): void {
    const updatedHeroes = this.superHeroes.value.map((hero) => {
      if (hero.id === newSuperHero.id) {
        return { ...hero, ...newSuperHero };
      }
      return hero;
    });
    this.superHeroes.next(updatedHeroes);
  }

  /* DELETE SUPERHERO */
  deleteSuperHero(id: string): void {
    const updatedHeroes = this.superHeroes.value.filter((hero) => hero.id !== id);
    this.superHeroes.next(updatedHeroes);
  }
}