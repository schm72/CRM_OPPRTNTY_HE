jQuery.sap.require("cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S4Custom", {
	departmentf4open: "",
	zzModuleIdf4open: "",
	OppTypef4open: "",
	onInit: function() {
		//Execute onInit for the base class BaseMasterController  
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		// department F4
		this.departmentF4Template = new sap.m.StandardListItem({
			title: "{DepartmentId}",
			description: "{parts:[{path : 'NameOrg1'},{path : 'NameOrg2'},{path : 'NameFirst'},{path : 'NameLast'},{path : 'NameLast2'}],formatter : 'cus.crm.opportunity.CRM_OPPRTNTY_HE.util.Formatter.getDepartmentDesc'}",
			active: true
		});
		this.departmentF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.departmentF4Template.data("ID", "{DepartmentId}");
		// HE Module Type F4
		this.zzModuleIdF4Template = new sap.m.StandardListItem({
			title: "{ZmoduleId}",
			description: "{ZmoduleName}",
			active: true
		});
		this.zzModuleIdF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.zzModuleIdF4Template.data("ID", "{ZmoduleId}");
		// HE opportunity Type F4
		this.OppTypeF4Template = new sap.m.StandardListItem({
			title: "{Description}",
			description: "{Type}",
			active: true
		});
		this.OppTypeF4Template.data("NAME", "{" + cus.crm.opportunity.util.schema.getFilterString(this.oModel) + "}");
		this.OppTypeF4Template.data("ID", "{Type}");
	},
	extHookAddCustomHeaderFields: function(oEntry) {
		// additional value - ZzfcDiscount
		var extensionZzfcDiscountValue = this.byId("idZzfcDiscount_e").getValue();
		oEntry.ZzfcDiscount = extensionZzfcDiscountValue;
		
		// additional value - ZzfcSellThr
		var extensionZzfcSellThrValue = this.byId("idZzfcSellThr_e").getValue();
		oEntry.ZzfcSellThr = extensionZzfcSellThrValue;  
		
		// additional value - ZzfcOppEnroll
		var extensionZzfcOppEnrollValue = this.byId("idZzfcOppEnroll_e").getValue();
		oEntry.ZzfcOppEnroll = extensionZzfcOppEnrollValue;  
		
		// additional value - zzModuleId
		var extensionzzModuleIdValue = this.byId("idzzModuleId_e").getValue();
		oEntry.zzModuleId = extensionzzModuleIdValue;  
		
		// additional value - ZzDepartment
		var extensionZzDepartmentValue = this.byId("idZzDepartment_e").getValue();
		oEntry.ZzDepartment = extensionZzDepartmentValue;  
		
		// additional value - zzOppType
		var extensionzzOppTypeValue = this.byId("idzzOppType_e").getValue();
		oEntry.zzOppType = extensionzzOppTypeValue;  

		return true;
	},
	extHookBindAdditionalFields: function(a) {
		// get the details for this edit page
		var oDataDetails = a.byId("info").getModel("json").getData();
		// set the values
		this.byId("idZzfcDiscount_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcDiscount));
		this.byId("idZzfcSellThr_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcSellThr));
		this.byId("idZzfcOppEnroll_e").setValue(cus.crm.opportunity.util.Formatter.texttonumber(oDataDetails.ZzfcOppEnroll));
		this.byId("idzzModuleId_e").setValue(oDataDetails.zzModuleId);
		this.byId("idZzDepartment_e").setValue(oDataDetails.ZzDepartment);
		this.byId("idzzOppType_e").setValue(oDataDetails.zzOppType);
	},

/* Department F4 Dialog methods */
	_setDepartmentF4Text: function(e) {
		if (this._departmentSelectDialog) {
    		this._departmentSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idZzDepartment_e').getValue());
    		this._departmentSelectDialog.getModel().detachRequestCompleted(this._setDepartmentF4Text, this);
		}
	},
	showDepartmentF4: function(e) {
	    if(typeof this.HeaderObject.ProspectNumber === "undefined" || this.HeaderObject.ProspectNumber === null || this.HeaderObject.ProspectNumber === "") {
	        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL")); 
	        return;
	    }
		if (!this._departmentSelectDialog) {
			this._departmentSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZDepartmentSelectDialog", this);
			this._departmentSelectDialog.setModel(this.getView().getModel());
			this._departmentSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._departmentSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._departmentSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_DEPARTMENT_TEXT"));
				}
			}, this._departmentSelectDialog);
			this._departmentSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._departmentSelectDialog.getModel().attachRequestCompleted(null, this._setDepartmentF4Text, this);
		var f = [];
		f.push(new sap.ui.model.Filter('LinkedBp', sap.ui.model.FilterOperator.EQ, this.HeaderObject.ProspectNumber));
		this._departmentSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			path: "/ZDepartmentSet",
			filters: f,
			template: this.departmentF4Template
		});
		this._departmentSelectDialog.open();
	},
	closeDepartmentF4: function(e) {
		this.byId('dialogDepartmentF4').close();
		this.departmentf4open = "";
	},
	setDepartment: function(e) {
		var params = e.getParameter("selectedItem");
		var idDepartment = params.data('ID');
		this.byId('idZzDepartment_e').setValue(idDepartment);
	},
	searchDepartment: function(e) {
	    if(typeof this.HeaderObject.ProspectNumber === "undefined" || this.HeaderObject.ProspectNumber === null || this.HeaderObject.ProspectNumber === "") {
	        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NO_LECTURER_SEL")); 
	        return;
	    }
		var f = [];
		f.push(new sap.ui.model.Filter('LinkedBp', sap.ui.model.FilterOperator.EQ, this.HeaderObject.ProspectNumber));
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('NameOrg1', sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	},
	
/* HE Module Type F4 Dialog methods */
	_setzzModuleIdF4Text: function(e) {
		if (this._zzModuleIdSelectDialog) {
    		this._zzModuleIdSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idzzModuleId_e').getValue());
    		this._zzModuleIdSelectDialog.getModel().detachRequestCompleted(this._setzzModuleIdF4Text, this);
		}
	},
	showzzModuleIdF4: function(e) {
		if (!this._zzModuleIdSelectDialog) {
			this._zzModuleIdSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZModuleSelectDialog", this);
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel());
			this._zzModuleIdSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._zzModuleIdSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_ZMODULE_TEXT"));
				}
			}, this._zzModuleIdSelectDialog);
			this._zzModuleIdSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._zzModuleIdSelectDialog.getModel().attachRequestCompleted(null, this._setzzModuleIdF4Text, this);
		var f = [];
		this._zzModuleIdSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			path: "/ZModuleCollection",
			parameters: {
				select: "ZmoduleId,ZmoduleName"
			},
			filters: f,
			template: this.zzModuleIdF4Template
		});
		this._zzModuleIdSelectDialog.open();
	},
	closezzModuleIdF4: function(e) {
		this.byId('dialogzzModuleIdF4').close();
		this.zzModuleIdf4open = "";
	},
	setzzModuleId: function(e) {
		var params = e.getParameter("selectedItem");
		var idzzModuleId = params.data('ID');
		this.byId('idzzModuleId_e').setValue(idzzModuleId);
	},
	searchzzModuleId: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('ZmoduleName', sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	},
	
/* HE Opportunity Type F4 Dialog methods */
	_setOppTypeF4Text: function(e) {
		if (this._OppTypeSelectDialog) {
    		this._OppTypeSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setValue(this.byId('idzzOppType_e').getValue());
    		this._OppTypeSelectDialog.getModel().detachRequestCompleted(this._setOppTypeF4Text, this);
		}
	},
	showOppTypeF4: function(e) {
		if (!this._OppTypeSelectDialog) {
			this._OppTypeSelectDialog = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTY_HE.view.ZOppTypeSelectDialog", this);
			this._OppTypeSelectDialog.setModel(this.getView().getModel());
			this._OppTypeSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			this._OppTypeSelectDialog.getAggregation('_dialog').getSubHeader().getContentMiddle()[0].setPlaceholder(sap.ca.scfld.md.app.Application
				.getImpl().getResourceBundle().getText("SEARCH"));
			this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingScrollToLoad(true);
			this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].setGrowingThreshold(20);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestSent(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("LOADING_TEXT"));
				}
			}, this._OppTypeSelectDialog);
			sap.ca.scfld.md.app.Application.getImpl().getConnectionManager().getModel().attachRequestCompleted(function() {
				if (this._list) {
					this._list.setNoDataText(this.getModel("i18n").getResourceBundle().getText("NO_OPPTYPE_TEXT"));
				}
			}, this._OppTypeSelectDialog);
			this._OppTypeSelectDialog.getAggregation('_dialog').setVerticalScrolling(true);
		}
		this._OppTypeSelectDialog.getModel().attachRequestCompleted(null, this._setOppTypeF4Text, this);
		var f = [];
		this._OppTypeSelectDialog.getAggregation('_dialog').getContent()[1].bindAggregation("items", {
			path: "/ZOpportunityTypeHESet",
			filters: f,
			template: this.OppTypeF4Template
		});
		this._OppTypeSelectDialog.open();
	},
	closeOppTypeF4: function(e) {
		this.byId('dialogOppTypeF4').close();
		this.OppTypef4open = "";
	},
	setOppType: function(e) {
		var params = e.getParameter("selectedItem");
		var idOppType = params.data('ID');
		this.byId('idzzOppType_e').setValue(idOppType);
	},
	searchOppType: function(e) {
		var f = [];
		var v = e.getParameter("value");
		if (v !== "") {
			f.push(new sap.ui.model.Filter('Description', sap.ui.model.FilterOperator.Contains, v));
		}
		var i = e.getParameter("itemsBinding");
		if (i) {
			i.aApplicationFilters = [];
			i.filter(f);
		}
	}
});