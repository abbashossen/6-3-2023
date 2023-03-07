import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IOptionsCaBase, IOptionsCaBaseAction, IOptionsCaComplexItemList, IOptionsCaImage, IOptionsInputCaBase, IOptionsListTemplate, IOptionsSwipableCaComplexItemList } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/custom-components/commonInterfaces';
import { AlertService } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/services/alert.service';
import { CommonService } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/services/common.service';
import { HttpServiceService } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/services/http-service.service';
import { LoggerService } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/services/logger.service';
import { TemplateListPage } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/app/templates/template-list/template-list.page';
import { urls } from 'src/app/tktFrntAdminCommon/src/app/tktFrntCommon/src/constants';

@Component({
  selector: 'app-all-machine-details',
  templateUrl: './all-machine-details.page.html',
  styleUrls: ['./all-machine-details.page.scss'],
})
export class AllMachineDetailsPage extends TemplateListPage implements OnInit {
  
  idupdate;
  empty = false;
  formGroup: FormGroup;
  formData = new FormData();
  //selectedCompleteDate = null;
  //adata;
//  caButtonOptions: IOptionsCaBaseAction = {
//     icon: "alarm-outline",
//     placeholder: "filter",
//   };

  // optInput: IOptionsInputCaBase = {
  //   formData: this.formData,
  //   isrequired: true,
  // };

 
  labels = [
     "machine_id",
     "driver-name",
     "starting_kilometrage",
     "starting_time",
    "ending_kilometrage",
     "ending_time",
     "income",
    "fuel",
    "date",
    
    
  ];
  classAttributes = [
     "machine_id",
     "name",
     "starting_kilometrage",
     "starting_time",
    "ending_kilometrage",
     "ending_time",
     "income",
    "amount",
    "date",
     
  ];

  default = "";
  //selectedtime = null;
  selectedDate = null;

  //caItemOptList: IOptionsSwipableCaComplexItemList[] = [];

  listoption: IOptionsListTemplate = {
    withsearchInput: true,
    itemSize: 10,
    emptyListMsg: "USERRESERVATIONS.nodata",
    displayMomentFormat: "DD/MM/YYYY",
    displayDateFormat: "D MMM YY ",
  };

  caLeftImageOptions: IOptionsCaImage = {
    base64: "../assets/left.png",
  };

  // iconsOpt: IOptionsCaBaseAction = {
  //   icon: "close-circle-outline",
  // };

  iconsOpt1: IOptionsCaBaseAction = {
    icon: "duplicate-outline",
  };

  caItemOpt: IOptionsCaComplexItemList = {
    labels: this.labels,
    classAttributes: this.classAttributes,
    title: "",
    iconsOptionsLeftList: [],
    iconsOptionsRightList: [this.iconsOpt1],

    withIcon: true,
    isSwipable: true,
   leftImage: this.caLeftImageOptions,
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    private commonservice: CommonService,
    public  alertService: AlertService,
    private httpservice: HttpServiceService,
    private formBuilder: FormBuilder,
    public menu: MenuController,
    private navCtrl: NavController,
    public platform: Platform,
    public ngZone: NgZone,
    public loggersrvice: LoggerService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    
    super(alertService, platform, ngZone, menu, loggersrvice);

    this.formGroup = this.formBuilder.group({});
    //this.optInput.formGroup = this.formGroup;
  }
   

  ngOnInit() {
    //this.fetchAllDrivers();
  }
  
  ionViewWillEnter() {
    super.ionViewWillEnter();
    //this.menu.close();
  }

  fetchAllDrivers(date?, call?) {
    this.resetList();
    this.listoption.isEmpty = true;
    this.listoption.isLoading = true;

    let param;

    this.commonservice
      .present()
      .then((resData) => {
        this.resetList();

        param = {
          date: this.selectedDate,
           //param to send
        };
      })
      .then((resData1) => {
        this.httpservice.sendrequest(urls.returnMachinesDetail, param).subscribe(
          /// call sendrequest method
          (data) => {
            this.listoption.isEmpty = true;
            this.listoption.isLoading = false;
            if (data["response"]) {
              this.resetList();
            } else {
              this.empty = false;
              this.listoption.isEmpty = false;
              this.listoption.isLoading = false;
              this.availableItems = [];
              this.availableItems = data["list"];
              
              let i = 0;
              if (this.availableItems) {
                this.availableItems.forEach((item, index) => {
                  this.update(item);
                  //  if (item["daily_income"] == 0 || item["fuel"] == 0 || item["end_KM"] == 0) {
                    // this.caLeftImageOptions.base64 = "assets/left11.png";
                  // }
                  this.items[i] = Object.assign({}, this.caItemOpt);
                  i++;
                  this.listoption.items = [...this.items];
                  //console.log(item["daily_income"]);
                 
                });
              }
            }
          },
          (error) => {
            this.resetList();
            this.listoption.isEmpty = true;
            this.loggersrvice.logError("ErrorConnection", error);
            this.alertService.presentToastwithtranslate("connectionError");
            this.commonservice.dismiss();
            if (call) call();
          },
          () => {
            this.commonservice.dismiss();
            if (call) call();
          }
        );
      });
  }

  update(d) {
    console.log(d);
    let caImage: IOptionsCaImage = {
      default: this.default,
    };
    
    this.idupdate = "d" + d.reservation_list_id;
    if (d.driver_profile)
      caImage.base64 = "data:image/jpeg;base64," + d.driver_profile;
    else {
      caImage.base64 = "../assets/profile.png";
    }

    this.caItemOpt.caImageOptions = caImage;
    this.caItemOpt.leftImage={base64:"assets/dot_red-removebg-preview (1).png"}
    //this.caItemOpt.leftImage.base64 = "assets/contactUs.svg";
    this.caItemOpt.leftLabel = d.reservation_list_status;
    this.caItemOpt.details = d ;
    if (d["income"] == 0 || d["ending_kilometrage"] == 0 || d["amount"] == 0 || d["ending_kilometrage_image"] == "") {
          this.caLeftImageOptions.base64 = "assets/dot_red-removebg-preview (1).png";
       this.caItemOpt.leftImage.base64 = "assets/dot_red-removebg-preview (1).png";
      
       
     } else {
   
         this.caLeftImageOptions.base64 = "../assets/left.png";
       this.caItemOpt.leftImage.base64 = "../assets/left.png";
       //console.log(d["daily_income"] +"bbbbbbb"+d["fuel"] +"ddddd"+d["end_KM"]);
                  }

    return this.caItemOpt;
  }

  reserveoOnTime(event) {
    let datet = event.split("T")[0];
    let d = event.split("T")[1];
    let m = d.split(":")[0];
    let n = d.split(":")[1];
    var tm = m + ":" + n + ":" + "00";
    //this.selectedtime = tm;
    this.selectedDate = datet;
    this.selectedCompleteDate = event;
    this.fetchAllDrivers( datet, event);
  }

  getData() {
    this.fetchAllDrivers(
      
     // this.selectedDate,
      
    );
  }

 

  async confirmKill(machine) {
      
     

    if (machine.event.option == "duplicate-outline") {
      this.navCtrl.navigateRoot("machine-details", {
        queryParams: {
          sendedData: {
            machine: machine.item,
          },
        },
      });
     
    }
  }
}
