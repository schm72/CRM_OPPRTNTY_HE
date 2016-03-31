sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S4Custom", {
	onInit: function() {
		//Execute onInit for the base class BaseMasterController  
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	},
	extHookAddCustomHeaderFields: function(oEntry) {
		// first additional value forecast discount - ZzfcDiscount
		var extensionDiscountValue = this.byId("idZzfcDiscount_e").getValue();
		oEntry.ZzfcDiscount = extensionDiscountValue;
		// first additional value forecast discount - ZzfcSellThr
		var extensionSellThroughValue = this.byId("idZzfcSellThr_e").getValue();
		oEntry.ZzfcSellThr = extensionSellThroughValue;  
		return true;
	},
	extHookBindAdditionalFields: function(a) {
		// get the details for this edit page
		var oDataDetails = a.byId("info").getModel("json").getData();
		// set the values
		this.byId("idZzfcDiscount_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcDiscount));
		this.byId("idZzfcSellThr_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcSellThr));
	}
});