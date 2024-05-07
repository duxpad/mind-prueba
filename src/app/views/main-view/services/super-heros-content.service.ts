import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import superHerosMock from '../../../../assets/mocks/superheros-data.json';

@Injectable({
  providedIn: 'root',
})
export class SuperHerosContentService {
  private superHeroes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(superHerosMock);
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
  getSuperHeroById(id: number): any {
    return this.superHeroes.value.find((hero) => hero.id === id);
  }

  /* FILTER SUPERHEROES BY NAME */
  filterSuperHeroes(superhero: string): any {
    return this.superHeroes.value.filter((hero) =>
      hero.superhero.toLowerCase().includes(superhero.toLowerCase())
    );
  }

  /* UPDATE SUPERHERO */
  updateSuperHero(id: number, newData: any): void {
    const updatedHeroes = this.superHeroes.value.map((hero) => {
      if (hero.id === id) {
        return { ...hero, ...newData };
      }
      return hero;
    });
    this.superHeroes.next(updatedHeroes);
  }

  /* DELETE SUPERHERO */
  deleteSuperHero(id: number): void {
    const updatedHeroes = this.superHeroes.value.filter((hero) => hero.id !== id);
    this.superHeroes.next(updatedHeroes);
  }
}