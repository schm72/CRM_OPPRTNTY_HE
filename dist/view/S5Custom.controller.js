sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S5Custom", {
	onInit: function() {
		//Execute onInit for the base class BaseMasterController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	},
	extHookSaveOentry: function(oEntry) {
		var oExtensionZzfcDiscount = this.byId("idZzfcDiscount");
		var valueZzfcDiscount = oExtensionZzfcDiscount.getValue();
		oEntry.ZzfcDiscount = valueZzfcDiscount;
		var oExtensionZzfcSellThr = this.byId("idZzfcSellThr");
		var valueZzfcSellThr = oExtensionZzfcSellThr.getValue();
		oEntry.ZzfcSellThr = valueZzfcSellThr;
	},
	extHookCustomLogicForAttachRouteMatch: function(e) {
		this.getView().addEventDelegate({
			onAfterShow: jQuery.proxy(function(evt) {
				this.onAfterShowOppExt(evt);
			}, this)
		});
	},
	onAfterShowOppExt: function(e) {
		this.byId("idZzfcDiscount").setValue("");
		this.byId("idZzfcSellThr").setValue("");
	}
});