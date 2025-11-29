sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/Panel",
    "sap/m/Title",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer",
    "sap/ui/core/CustomData",
    "sap/ui/core/Fragment",
    "sap/m/TextArea",
    "sap/m/FormattedText",
    "sap/m/MessageToast",
    "sap/ui/core/message/Message"
], function (
    Controller, HBox, VBox, Text, Label, Button,
    Panel, Title, OverflowToolbar, ToolbarSpacer,
    CustomData, Fragment, TextArea, FormattedText, MessageToast, Message
) {
    "use strict";

    var msgType;
    var pendingMessage;
    var omsg = [];

    return Controller.extend("project1.controller.View1", {

        onInit: function () {
            var oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(this.getView(), true);
        },

        onMessagePopoverPress: function (oEvent) {
            var oSourceControl = oEvent.getSource();
            this._getMessagePopover().then(function (oMessagePopover) {
                oMessagePopover.openBy(oSourceControl);
            });
        },

        _getMessagePopover: function () {
            var oView = this.getView();
            if (!this._pMessagePopover) {
                this._pMessagePopover = Fragment.load({
                    id: oView.getId(),
                    name: "project1.fragments.MessagePopover"
                }).then(function (oMessagePopover) {
                    oView.addDependent(oMessagePopover);
                    return oMessagePopover;
                });
            }
            return this._pMessagePopover;
        },

        onClick: function () {
            var oView = this.getView();
            oView.byId("IdToolbar").setVisible(false);
            var that = this;

            var sView = oView.byId("idSelectView").getSelectedKey();
            var oContainer = oView.byId("containerVBox");
            oContainer.destroyItems();

            var panelNames = [];
            if (sView === "view1") {
                panelNames = ["Planning", "Distribution", "Collections"];
            } else if (sView === "view2") {
                panelNames = ["Teamcoll", "Exitor View", "Lambayat", "Dinevi"];
            }

            for (var i = 0; i < panelNames.length; i++) {
                var panelHeader = panelNames[i];

                let panelId = "panel_" + i;
                let panelId2 = "panel_inner_1_" + i;
                let panelId3 = "panel_inner_2_" + i;

                let redButtonId = "btnRed_" + i;
                let yellowButtonId = "btnAmber_" + i;
                let greenButtonId = "btnGreen_" + i;

                let RTEId1 = "rte1_" + i;
                let RTEId2 = "rte2_" + i;

                let oPanel = new Panel({
                    id: panelId,
                    content: [
                        new OverflowToolbar({
                            content: [
                                new Title({ text: panelHeader }),
                                new Label({ text: "(something)" })
                            ]
                        }),
                        new HBox({
                            justifyContent: "Start",
                            items: [
                                new VBox({
                                    width: "100%",
                                    items: [
                                        new Panel({
                                            id: panelId2,
                                            content: [
                                                new OverflowToolbar({
                                                    content: [
                                                        new Button({
                                                            id: redButtonId,
                                                            text: "Red",
                                                            type: "Reject",
                                                            press: function (oEvent) {
                                                                that.onRedPress(oEvent);
                                                            },
                                                            customData: [
                                                                new CustomData({ key: "RTEid1", value: RTEId1 }),
                                                                new CustomData({ key: "RTEid2", value: RTEId2 })
                                                            ]
                                                        }),
                                                        new Button({
                                                            id: yellowButtonId,
                                                            text: "Amber",
                                                            type: "Attention",
                                                            press: function (oEvent) {
                                                                that.onYellowPress(oEvent);
                                                            },
                                                            customData: [
                                                                new CustomData({ key: "RTEid1", value: RTEId1 }),
                                                                new CustomData({ key: "RTEid2", value: RTEId2 })
                                                            ]
                                                        }),
                                                        new Button({
                                                            id: greenButtonId,
                                                            text: "Green",
                                                            type: "Accept",
                                                            press: function (oEvent) {
                                                                that.onGreenPress(oEvent);
                                                            },
                                                            customData: [
                                                                new CustomData({ key: "RTEid1", value: RTEId1 }),
                                                                new CustomData({ key: "RTEid2", value: RTEId2 })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                new TextArea({
                                                    id: RTEId1,
                                                    width: "100%",
                                                    height: "250px",
                                                    editable: true
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new VBox({
                                    width: "100%",
                                    items: [
                                        new Panel({
                                            id: panelId3,
                                            content: [
                                                new FormattedText({
                                                    htmlText: "<div style='padding-bottom:12px'></div>"
                                                }),
                                                new Button({
                                                    text: "",
                                                    type: sap.m.ButtonType.Ghost,
                                                    enabled: false
                                                }),
                                                new ToolbarSpacer(),
                                                new TextArea({
                                                    id: RTEId2,
                                                    width: "100%",
                                                    height: "250px",
                                                    editable: false
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                });

                oContainer.addItem(oPanel);
            }

            MessageToast.show("Panels loaded for " + sView);
        },

        onRedPress: function (oEvent) {
            this._handlePress(oEvent, "RED", "Red is pressed");
        },

        onYellowPress: function (oEvent) {
            this._handlePress(oEvent, "AMBER", "Amber is pressed");
        },

        onGreenPress: function (oEvent) {
            this._handlePress(oEvent, "GREEN", "Green is pressed");
        },

        _handlePress: function (oEvent, colorPrefix, commentText) {
            var oButton = oEvent.getSource();
            var RTEId1 = oButton.getCustomData().find(cd => cd.getKey() === "RTEid1").getValue();
            var RTEId2 = oButton.getCustomData().find(cd => cd.getKey() === "RTEid2").getValue();

            var oLeftTA = sap.ui.getCore().byId(RTEId1);
            var oRightTA = sap.ui.getCore().byId(RTEId2);

            if (oLeftTA) {
                var sComment = oLeftTA.getValue().trim();
                if (sComment) {
                    oRightTA.setValue(oRightTA.getValue() + colorPrefix + ":" + sComment + "\n");
                    oLeftTA.setValue("");
                }
            }

            omsg.push({ comment: commentText });
        },

        onSubmit: function () {
            var oMM = sap.ui.getCore().getMessageManager();

            omsg.forEach(item => {
                if (item.comment) {
                    var oMessage = new sap.ui.core.message.Message({
                        message: item.comment,
                        type: sap.ui.core.MessageType.Success
                    });
                    oMM.addMessages(oMessage);
                }
            });

            omsg = [];
            MessageToast.show("Submitted!");
        }

    });
});
