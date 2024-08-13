import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApexChart, ApexNonAxisChartSeries, ApexDataLabels, ApexTitleSubtitle } from 'ng-apexcharts';
import { environment } from 'src/enviroment/enviroment';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export type ChartOptions = {
  series: ApexNonAxisChartSeries; // Cambiar a ApexNonAxisChartSeries
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  labels: string[];
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-visit-chart-module',
  templateUrl: './visit-chart-module.component.html',
  styleUrls: ['./visit-chart-module.component.css']
})
export class VisitChartModuleComponent implements OnInit {
  public chartOptions: ChartOptions;
  private apiURL = environment.apiURL;
  private currentUser: any;
  dateForm!: FormGroup;

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) {
    // Inicializa con valores por defecto
    this.chartOptions = {
      series: [],
      chart: {
        type: 'pie',
        height: 500 // Añadir altura predeterminada, opcional
      },
      labels: ['Sin datos'],
      dataLabels: {
        enabled: true
      },
      title: {
        text: 'Visitas por Fecha'
      }
    };
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    //this.loadVisitData();
  }

  createForm() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateForm = this.fb.group({
      firstDate: [startOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]],
      endDate: [endOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]]
    });
  }

  dateRangeValidator(control: any) {
    const startDate = this.dateForm?.get('firstDate')?.value;
    const endDate = this.dateForm?.get('endDate')?.value;
    return startDate && endDate && endDate < startDate ? { dateRange: true } : null;
  }

  loadVisitData() {
    if (this.dateForm.invalid) {
      return;
    }
    const { firstDate, endDate } = this.dateForm.value;
    this.http.get<any>(`${this.apiURL}/visits`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }).subscribe({
      next: (data: any[]) => {
        const visitCounts: { [key: string]: number } = {};

        data.forEach(visit => {
          const date = visit.visit_date;
          visitCounts[date] = (visitCounts[date] || 0) + 1;
        });

        this.chartOptions.series = Object.values(visitCounts); // Aquí se asignan los valores
        this.chartOptions.labels = Object.keys(visitCounts);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de visitas', 'error');
      }
    });
  }
}
