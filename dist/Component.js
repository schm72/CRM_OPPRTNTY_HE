jQuery.sap.declare("cus.crm.opportunity.CRM_OPPRTNTY_HE.Component");
(function() {
	jQuery.sap.registerModulePath("sap.cus.crm.lib.reuse", "/sap/bc/ui5_ui5/sap/crm_lib_reuse/sap/cus/crm/lib/reuse");
}());
// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "cus.crm.opportunity",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/CRM_OPPRTNTY" // we use a URL relative to our own component
		// extension application is deployed with customer namespace
});
this.cus.crm.opportunity.Component.extend("cus.crm.opportunity.CRM_OPPRTNTY_HE.Component", {
	metadata: {
		version: "1.0",
		config: {
			"sap.ca.serviceConfigs": [{
				name: "ZCRM_OPPORTUNITY_HE",
				serviceUrl: "/sap/opu/odata/sap/ZCRM_OPPORTUNITY_HE_SRV/",
				isDefault: true
			}],
			"sap.ca.i18Nconfigs": {
				"bundleName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.i18n.i18n_custom"
			}
		},
		customizing: {
			"sap.ui.viewExtensions": {
				"cus.crm.opportunity.view.S5": {
					"salesAreaCreateContentTopExtension": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S5_salesAreaCreateContentTopExtensionCustom",
						"type": "XML"
					}
				},
				"cus.crm.opportunity.view.S3": {
					"opportunityInfoTabContentBottomExtension": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3_opportunityInfoTabContentBottomExtensionCustom",
						"type": "XML"
					},
					"opportunityTabBarItemLastExtension": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3_opportunityTabBarItemLastExtensionCustom",
						"type": "XML"
					}
				},
				"cus.crm.opportunity.view.S4": {
					"opportunityEditContentBottomExtension": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S4_opportunityEditContentBottomExtensionCustom",
						"type": "XML"
					}
				}
			},
			"sap.ui.controllerExtensions": {
				"cus.crm.opportunity.view.S4": {
					"controllerName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S4Custom"
				},
				"cus.crm.opportunity.view.S5": {
					"controllerName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S5Custom"
				},
				"cus.crm.opportunity.view.S3": {
					"controllerName": "cus.crm.opportunity.CRM_OPPRTNTY_HE.view.S3Custom"
				}
			},
			"sap.ui.viewModifications": {
				"cus.crm.opportunity.view.S5": {
					"opportunityContact_Label": {
						"visible": false
					},
					"inputMainContact": {
						"visible": false
					}
				},
				"cus.crm.opportunity.view.S4": {
					"inputMainContact": {
						"visible": false
					},
					"mainContactLabel_S4": {
						"visible": false
					}
				}
			}
		}
	}
});