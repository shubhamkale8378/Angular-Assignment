import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from "../../Interfaces/interface";
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProductService } from 'src/app/services/product.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import Chart, { BubbleDataPoint, ChartDataset, ChartTypeRegistry, Point } from 'chart.js/auto';
@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css'],

})
export class ProductMasterComponent implements OnInit {
  form!: FormGroup
  showData: Product[] = [];
  chart!: Chart; // Define chart variable

  httpProductService = inject(ProductService)


  index: any;
  data: any;
  // Add pagination-related properties
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page number
  selectedRowIndices: number[] = [];
  selectedRows: boolean[] = [];
  selectAll: boolean = false; // Define and initialize selectAll variable

  category: any;

  selectedcategory: any;

  totalRecords: number = 0;
  selectedProducts: Product[] = [];



  isSubmit: boolean = true;
  isUpdate: boolean = false;
  visible: boolean = false;
  loading: boolean = false;
  products: any;
  selectedCountry: any | undefined;
  productData: any;
  dataID: any;
  resposeDataa: any;
  productID: any;
  constructor(private fb: FormBuilder, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      category: [null, Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
    this.dropdown()
    this.createChart()
  }
  createChart() {
    // Convert prices to numbers
    const products = this.resposeDataa.map((product: any) => ({
      ...product,
      price: Number(product.price)  // Convert price to number
    }));

    // Calculate category-wise price totals
    const categoryTotals: { [key: string]: number } = {};
    products.forEach((product: any) => {
      const { category, price } = product;
      if (categoryTotals[category]) {
        categoryTotals[category] += price;
      } else {
        categoryTotals[category] = price;
      }
    });
    console.log('Category-wise Price Totals:', categoryTotals);

    // Extract categories and their total prices for the chart
    const categories = Object.keys(categoryTotals);
    const prices = Object.values(categoryTotals);

    if (this.chart) {
      this.chart.data.labels = categories;
      this.chart.data.datasets[0].data = prices;
      this.chart.update();
    } else {
      this.chart = new Chart('MyChart', {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Category Estimate',
              data: prices,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }




  dropdown() {
    this.products = [
      { category: 'Electronics', code: 'EL' },
      { category: 'Fashion', code: 'FA' },
      { category: 'Home & Kitchen', code: 'HK' },
      { category: 'Health & Beauty', code: 'HB' },
      { category: 'Sports & Outdoors', code: 'SO' },
    ];
    this.loadProducts({ first: 0, rows: 10 });
    // this.getProduct()
  }

  submitProduct() {
    this.loading = true;
    if (this.form.valid) {

      const formData = {
        ...this.form.value,
        category: this.selectedcategory.category
      };
      console.log({ formData });
      this.httpProductService.postProduct('posts', formData).subscribe((res: Product) => {
        console.log({ res });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product is Created Successfully` });
        this.form.reset();
        this.loadProducts({ first: 0, rows: 10 });
        console.log("The Product has been successfully Created");
        this.loading = false
        this.visible = false;
      }, err => {
        console.log("Something went wrong creating the Product", err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Something went wrong !!!` });
      })
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
      console.log("Validation finished");
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill valid data!!!` });
      this.loading = false
    }
  }
  updateProduct() {
    this.loading = true;
    if (this.form.valid) {

      const formData = {
        ...this.form.value,
        category: this.selectedcategory.category
      };
      console.log({ formData });
      this.httpProductService.updateProduct('posts', this.productID, formData).subscribe((res: Product) => {
        console.log({ res });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product is update Successfully` });
        this.form.reset();
        this.loadProducts({ first: 0, rows: 10 });
        console.log("The Product has been successfully update");
        this.loading = false
        this.visible = false;

        this.isSubmit = true
        this.isUpdate = false

      }, err => {
        console.log("Something went wrong updating the Product", err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Something went wrong !!!` });
      })
    } else {
      this.form.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
      console.log("Validation finished");
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill valid data!!!` });
      this.loading = false
    }
  }



  loadProducts(event: TableLazyLoadEvent) {
    if (!this.isLazyLoadEvent(event)) {
      console.error("Invalid event format");
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.httpProductService.getProduct('posts').subscribe((res: any) => {
        let filteredProducts = res;


        this.resposeDataa = res;
        console.log("Initial Products:", filteredProducts);

        // Handle global filtering
        if (event.filters) {
          Object.keys(event.filters).forEach(key => {
            const filterMeta = event.filters![key];
            let filterValue: string = '';

            if (Array.isArray(filterMeta)) {
              filterValue = filterMeta[0]?.value ?? '';
            } else {
              filterValue = filterMeta?.value ?? '';
            }

            console.log(`Filtering on field: ${key}, Filter Value: "${filterValue}"`);

            // Apply filter only if filterValue is not empty
            if (filterValue) {
              filteredProducts = filteredProducts.filter((product: any) => {
                const fieldValue = product[key as keyof any];
                if (typeof fieldValue === 'string') {
                  return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
                }
                return fieldValue === filterValue;
              });
            }


          });
        }
        console.log('Filtered Products:', filteredProducts);

        this.productData = filteredProducts.slice(event.first ?? 0, (event.first ?? 0) + (event.rows ?? 10));
        this.totalRecords = filteredProducts.length;
        this.loading = false;
        this.createChart()
        console.log('Displayed Products:', this.productData);
      }, error => {
        console.error("Error fetching products:", error);
        this.loading = false;
      });
    }, 50);
  }

  isLazyLoadEvent(event: any): event is TableLazyLoadEvent {
    return 'rows' in event && (typeof event.rows === 'number' || event.rows === undefined);
  }


  deleteAction(product: any) {
    this.httpProductService.deleteProduct('posts', product.id).subscribe((res) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product is Deleted Successfully` });
      this.loadProducts({ first: 0, rows: 10 });
      this.createChart()
      console.log({ onDeleteProduct: res });
    });
  }

  editAction(product: any) {
    this.isSubmit = false;
    this.isUpdate = true;
    this.visible = true;
    this.selectedcategory = this.products.find((p: any) => p.category === product.category);
    this.form.patchValue({
      category: this.selectedcategory,
      name: product.name,
      price: product.price,
      id: product.id
    });
    this.productID = product.id;
  }


  showDialog() {
    this.isSubmit = true
    this.isUpdate = false
    this.form.reset();
    this.visible = true;
  }
}
