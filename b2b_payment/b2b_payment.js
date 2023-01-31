import { LightningElement,api,wire } from 'lwc';
import getPaymentInfo from '@salesforce/apex/B2BPaymentController.getPaymentInfo';
import { NavigationMixin } from 'lightning/navigation';
import setPaymentInfo from '@salesforce/apex/B2BPaymentController.setPaymentInfo';

import getVFOrigin from '@salesforce/apex/B2BPaymentController.getVFOrigin';

import updatePAError from '@salesforce/apex/B2BPaymentController.updatePaymentAuthError';

import submitCreditCardOrder from '@salesforce/apex/B2BPaymentController.submitCreditCardOrder';

import getAccountDetails from '@salesforce/apex/B2B_PaymentMethodController.getAccountDetails';

import updateCreditLimit from '@salesforce/apex/B2B_PaymentMethodController.updateCreditLimit';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class B2b_payment extends LightningElement {
  /*  showTabFour = true;
    msg = '';
    cvvMsg = '';
    dateMsg = '';
    showMsg = false;
    @track isCardNumberEntered= false;
    @track isCvvEntered= false;
    @track isExpirationDateEntered = true;
    number;
    cvv;
    month;
    year;

    get submitDisabled() {
        return this.isExpirationDateEntered 
        // this.isExpirationDateEntered && !this.isCardNumberEntered

    }

    checkValidationForNumber() {
        console.log('checkValidationForNumber');
        this.number = parseInt(this.template.querySelector(".number").value);
        if(this.number.toString().length < 16){
            this.showMsg =  true;
            this.msg = 'Please Enter valid card Number'
            this.isCardNumberEntered = true;
            console.log('number not correct');
        }
        else{
            this.showMsg = false;
            this.isCardNumberEntered = false;
        }
        console.log('numbber' + this.isCardNumberEntered)
    }

    checkValidationForCvv(){
        this.cvv =  parseInt(this.template.querySelector(".cvv").value);
        if(this.cvv.toString().length < 3){
            this.cvvMsg = 'Please Enter valid cvv'
            this.isCvvEntered = true
            console.log('cvv not correct');
        }
        else{
            this.isCvvEntered = false
        }
        console.log('cvvvv' + this.isCvvEntered)

    }

    checkValidationExpirationDateChange() {
        console.log('checkValidationExpirationDateChange');
        this.year = parseInt(this.template.querySelector(".year").value)
        this.month = parseInt(this.template.querySelector(".month").value);
        console.log(this.year,this.month)
        console.log(new Date().getFullYear())
        console.log(new Date().getMonth())
        if(this.year > new Date().getFullYear()) {
            this.isExpirationDateEntered = this.month > 0 && this.month <=12;
            console.log('yea1  correct');
        } else if(this.year == new Date().getFullYear()) {
            this.isExpirationDateEntered = this.month >= new Date().getMonth()+1 && this.month > 0 && this.month <=12;
            console.log('year2  correct');
        } else {
            this.isExpirationDateEntered = false;
            this.dateMsg = 'Please Enter Valid Month/year'
        }
        console.log('date'  + this.isExpirationDateEntered);
    }
    handleSubmitPaymentForm(){
        console.log('payment submit');
    }
    handleSubmitPurchaseOrder(){
        console.log('purchase order');
    }*/
    /*@api cartId;
    cart;
    iframeUrl;
    // Wire getVFOrigin Apex method to a Property
    @wire(getVFOrigin)
    vfOrigin;

    canPay = false;
    stripeCustomerId = '';
    iframeUrl;
    showSpinner = false;
    connectedCallback() {
        window.addEventListener("message", this.handleVFResponse.bind(this));
        let dataMap = {
            cartId: this.cartId
        };
        this.showSpinner = true;
        getPaymentInfo({
            dataMap: dataMap
        }).then((result) => {
            console.log('get payment info');
            console.log(result);
            
                this.showSpinner = false;
                if (result && result.isSuccess) {
                    this.canPay = result.canPay;
                    this.cart = result.cart;
                    this.stripeCustomerId = result.stripeCustomerId ;
                    this.iframeUrl = result.iframeUrl;
                } else {
                    this.showToast('No payment Methods Found', 'error');
                }
            })
            .catch((e) => {
                this.showToast(
                    'Some Error occured while processing this Opportunity,Please contact System admin.',
                    'error'
                );
            });
    }

    showToast(message ,variant) {
        let title = variant == 'error' ? 'Error' : 'Success';
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleVFResponse(message){
        console.log('handleVFResponse');
        console.log(message);
        var cmp = this;
        if (message.origin === this.vfOrigin.data) {
            let receivedMessage = message.data;
            if(receivedMessage && receivedMessage != null){
                if(receivedMessage.hasOwnProperty('paId')){
                    let dataMap = {
                        paId: receivedMessage.paId
                    }
                    updatePAError({dataMap: dataMap})
                    .then(function (result) {
                        cmp.showSpinner = false;
                    });
                }else{
                    if(receivedMessage.cToken && receivedMessage.cToken != null &&  receivedMessage.cToken.token && receivedMessage.cToken.token != null){
                        if(this.submitOrderCalled){
                            return ;
                        }
                        this.submitOrderCalled = true;
                        this.submitCCOrder(receivedMessage);
                    }
                }
            }
        }
    }

    submitCCOrder(receivedMessage){
        let dataMap = {
            "cartId": this.cartId,
            "paymentMethod": 'CC',
            "stripeCustomerId": this.stripeCustomerId,
            "cToken": receivedMessage.cToken.token,
            "cPay" : receivedMessage.cPay.paymentIntent,
            "cTokenId": receivedMessage.cToken.token.id,
            "cPayId" : receivedMessage.cPay.paymentIntent.id
        };
        submitCreditCardOrder({
            dataMap: dataMap
        }).then((result) => {
            this.showSpinner = false;
            if(result && result.isSuccess){
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }else{
                this.showToast(result.msg,'error');
            }
        }).catch((e) => {
            this.showToast(
                e.message,
                'error'
            );
        });
    }

    errorCallback(err) {
        alert(err);
    }

    submitOrder(){
        let dataMap = {
            "cartId": this.cartId,
            "paymentMethod": 'CC',
            "stripeCustomerId": this.stripeCustomerId
        };
        this.showSpinner = true;
        setPaymentInfo({
            dataMap: dataMap
        }).then((result) => {
            
            if(result && result.PI_Secret){
                result.billing_details = {
                    name : this.cart.CreatedBy.Name,
                    email : this.cart.CreatedBy.Email
                };
                this.handleFiretoVF(result);
            }
        }).catch((e) => {
            this.showToast(
                e.message,
                'error'
            );
        });
    }

    handleFiretoVF(message) {
        console.log('handleFiretoVF');
        this.template.querySelector("iframe").contentWindow.postMessage(message, this.vfOrigin.data);
    }*/

    @api cartId;
    @api poNumber;
    @api paymentType = 'PurchaseOrderNumber';
    checkLimitButton = true;
    checkLimitData = false;


    cart;
    iframeUrl;
    // Wire getVFOrigin Apex method to a Property
    @wire(getVFOrigin)
    vfOrigin;

    canPay = false;
    stripeCustomerId = '';
    iframeUrl;
    showSpinner = false;

    summaryData = {};

    getAccountDetails()
    {
        getAccountDetails({cartId : this.cartId})
        .then(result=>{
            if(result)
            {
                console.log(result);
                this.summaryData = result;
                if(result.ApprovedForCredit==false)
                {
                    this.paymentType = 'CardPayment';
                }
            }
        })
        .catch(error=>{
            console.log('** error' + JSON.stringify(error));
        })
    }


    
    PONumberHandler(event)
    {
        this.poNumber = event.target.value;
    }

    handlePONumber()
    {
        this.paymentType = 'PurchaseOrderNumber';
    }

    handleCreditPayment()
    {
        this.paymentType = 'CardPayment';
    }

    checkLimitHandler()
    {
        this.checkLimitButton = false;
        this.checkLimitData = true;
    }


    connectedCallback() {
        this.getAccountDetails();
        window.addEventListener("message", this.handleVFResponse.bind(this));
        let dataMap = {
            cartId: this.cartId
        };
        this.showSpinner = true;
        getPaymentInfo({
            dataMap: dataMap
        }).then((result) => {
            console.log(result);
                this.showSpinner = false;
                if (result && result.isSuccess) {
                    this.canPay = result.canPay;
                    this.cart = result.cart;
                    this.stripeCustomerId = result.stripeCustomerId ;
                    this.iframeUrl = result.iframeUrl;
                } else {
                    this.showToast('No payment Methods Found', 'error');
                }
            })
            .catch((e) => {
                this.showToast(
                    'Some Error occured while processing this Opportunity,Please contact System admin.',
                    'error'
                );
            });
    }

    showToast(message ,variant) {
        let title = variant == 'error' ? 'Error' : 'Success';
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleVFResponse(message){
        console.log('handleVFResponse');
        console.log(message);
        var cmp = this;
        if (message.origin === this.vfOrigin.data) {
            let receivedMessage = message.data;
            if(receivedMessage && receivedMessage != null){
                if(receivedMessage.hasOwnProperty('paId')){
                    let dataMap = {
                        paId: receivedMessage.paId
                    }
                    updatePAError({dataMap: dataMap})
                    .then(function (result) {
                        cmp.showSpinner = false;
                    });
                }else{
                    if(receivedMessage.cToken && receivedMessage.cToken != null &&  receivedMessage.cToken.token && receivedMessage.cToken.token != null){
                        if(this.submitOrderCalled){
                            return ;
                        }
                        this.submitOrderCalled = true;
                        this.submitCCOrder(receivedMessage);
                    }
                }
            }
        }
    }

    submitCCOrder(receivedMessage){
        let dataMap = {
            "cartId": this.cartId,
            "paymentMethod": 'CC',
            "stripeCustomerId": this.stripeCustomerId,
            "cToken": receivedMessage.cToken.token,
            "cPay" : receivedMessage.cPay.paymentIntent,
            "cTokenId": receivedMessage.cToken.token.id,
            "cPayId" : receivedMessage.cPay.paymentIntent.id
        };
        submitCreditCardOrder({
            dataMap: dataMap
        }).then((result) => {
            this.showSpinner = false;
            if(result && result.isSuccess){
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }else{
                this.showToast(result.msg,'error');
            }
        }).catch((e) => {
            this.showToast(
                e.message,
                'error'
            );
        });
    }

    errorCallback(err) {
        alert(err);
    }

    submitOrder(){
        console.log(this.paymentType);
        if(this.paymentType=='PurchaseOrderNumber')
        {
            console.log('Inside PO Number');
            if(this.summaryData.GrandTotalAmount < this.summaryData.CreditLimit)
            {
                updateCreditLimit({cartId : this.cartId, grandTotal : this.summaryData.GrandTotalAmount, creditLimit : this.summaryData.CreditLimit})
                .then((result) => {
                    console.log(result);
                }).catch((e) => {
                    console.log('** error' + JSON.stringify(e));
                });
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }
            else{
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: 'Customer Credit Limit is Exceeded. Please Check...',
                });
                this.dispatchEvent(event);
            }
            
        }
        else{
            console.log('Inside CC')
            let dataMap = {
                "cartId": this.cartId,
                "paymentMethod": 'CC',
                "stripeCustomerId": this.stripeCustomerId
            };
            this.showSpinner = true;
            setPaymentInfo({
                dataMap: dataMap
            }).then((result) => {
                
                if(result && result.PI_Secret){
                    result.billing_details = {
                        name : this.cart.CreatedBy.Name,
                        email : this.cart.CreatedBy.Email
                    };
                    this.handleFiretoVF(result);
                }
            }).catch((e) => {
                this.showToast(
                    e.message,
                    'error'
                );
            });
        }
    }

    handleFiretoVF(message) {
        console.log('handleFiretoVF');
        this.template.querySelector("iframe").contentWindow.postMessage(message, this.vfOrigin.data);
    }


}