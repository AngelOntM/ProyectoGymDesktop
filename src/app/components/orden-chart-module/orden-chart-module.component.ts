import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApexChart, ApexAxisChartSeries, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { environment } from 'src/enviroment/enviroment';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-orden-chart-module',
  templateUrl: './orden-chart-module.component.html',
  styleUrls: ['./orden-chart-module.component.css']
})
export class OrdenChartModuleComponent implements OnInit {
  public chartOptions: ChartOptions;
  private apiURL = environment.apiURL;
  private currentUser: any;
  dateForm!: FormGroup;

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 500
      },
      xaxis: {
        type: 'datetime', // Establecemos el tipo como datetime
        labels: {
          format: 'yyyy-MM-dd', // Formato para las etiquetas de fecha
          datetimeUTC: true // Utilizamos UTC para evitar problemas de zona horaria
        },
        tickPlacement: 'between' // Asegura que los ticks estén entre las barras
      },
      title: {
        text: 'Ganancias por Día'
      }
    };
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    //this.loadOrderData();
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

  loadOrderData() {
    if (this.dateForm.invalid) {
      return;
    }
    const { firstDate, endDate } = this.dateForm.value;
    this.http.get<any>(`${this.apiURL}/orders`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }).subscribe({
      next: (data: any[]) => {
        const earningsByDate: { [key: number]: number } = {}; // Usamos timestamps como claves

        data.forEach(order => {
          if(order.estado == "Pagada"){
            const date = order.order_date.split(' ')[0]; // Extraemos solo la fecha, sin la hora
            const timestamp = new Date(date).getTime(); // Convertimos la fecha a timestamp
            const amount = parseFloat(order.total_amount);
  
            earningsByDate[timestamp] = (earningsByDate[timestamp] || 0) + amount;
          }
        });

        // Convertimos los datos en el formato requerido por ApexCharts
        const sortedTimestamps = Object.keys(earningsByDate).map(ts => parseInt(ts)).sort();
        this.chartOptions.series = [{
          name: 'Ganancia',
          data: sortedTimestamps.map(timestamp => [timestamp, earningsByDate[timestamp]])
        }];
        this.chartOptions.xaxis.categories = sortedTimestamps; // Establecemos los timestamps en el eje X
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de órdenes', 'error');
      }
    });
  }
}
