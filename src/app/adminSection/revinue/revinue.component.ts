import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';;

@Component({
  selector: 'app-revinue',
  templateUrl: './revinue.component.html',
  styleUrl: './revinue.component.css'
})
export class RevinueComponent implements OnInit {

  revenueData: Object = {};

  private apiUrl = 'http://localhost:3000/revenue';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRevenueData();
  }

  fetchRevenueData(): void {
    this.http.get<Object>(this.apiUrl)
      .subscribe(data => {

        this.revenueData = data;
      });
  }
}