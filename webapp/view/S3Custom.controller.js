sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3Custom", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3Custom
	 */
	onInit: function() {
		//Execute onInit for the base class BaseMasterController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	},
	extHookGetDataForDetailScreen: function() {
		// Place your hook implementation code here 
		this.zsServiceUrl = this.sPath + "/ZCompProducts";
		//this.zsServiceUrl = "Opportunities(guid'005056B0-3325-1ED5-B2B8-1F063CF35FDB')/ZCompProducts";
		var that = this;
		this.oModel.read(this.zsServiceUrl, null, null, true, function(oData) {
			if (!oData || typeof oData === "undefined" || oData.results.length === 0) {
				that.byId("tab_CompProducts").setVisible(false);
			} else {
				that.byId("tab_CompProducts").setVisible(true);
			}
		}, function(oError) {
			that.byId("tab_CompProducts").setVisible(false);
		});
	},
	extHookSelectedTab: function(c) {
		var selTab = c.getSource().getSelectedKey();
		if( selTab === "CompetitorProducts" ) {
			var zReqServiceUrl = "/" + this.zsServiceUrl;
			var aFilters = [];
			var zoCompTable = this.getView().byId("CompProducts_Tab");
			zoCompTable.unbindAggregation("items");
			zoCompTable.bindAggregation("items", {
				path     : zReqServiceUrl,
				template : sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3_oppTabCustCompProdItems", this),
				filters  : aFilters
			});
		}
	}
});