import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-detail',
  imports: [],
  template: ` <h1>Tag Detail</h1>
    <p>Collection ID: {{ collectionId }}</p>`,
})
export class TagDetailComponent implements OnInit {
  collectionId!: string;
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.collectionId = params['tagId'];
      console.log('Tag ID:', this.collectionId);
    });
  }
}
