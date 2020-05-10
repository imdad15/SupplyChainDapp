App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchAvacadosBufferOne();
            App.fetchAvacadosBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestAvacados(event);
                break;
            case 2:
                return await App.packAvacados(event);
                break;
            case 3:
                return await App.wholesaleAvacados(event);
                break;
            case 4:
                return await App.buyAvacados(event);
                break;
            case 5:
                return await App.shipAvacados(event);
                break;
            case 6:
                return await App.receiveAvacados(event);
                break;
            case 7:
                return await App.preConditionAvacados(event);
                break;
            case 8:
                return await App.sellAvacados(event);
                break;    
            case 9:
                return await App.purchaseAvacados(event);
                break;
            case 10:    
                return await App.fetchAvacadosBufferOne(event);
                break;
            case 11:
                return await App.fetchAvacadosBufferTwo(event);
                break;
            }
    },

    harvestAvacados: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestAvacados(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('harvestAvacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packAvacados(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('packavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    wholesaleAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.wholesaleAvacados(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('sellavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyAvacados(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('buyavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipAvacados(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('shipavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveAvacados(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('receiveavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    preConditionAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.preConditionAvacados(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('packavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(4, "ether");
            console.log('productPrice',productPrice);
            return instance.sellAvacados(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('sellavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseAvacados: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseAvacados(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-avacados").text(result);
            console.log('purchaseavacados',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchAvacadosBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchAvacadosBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-avacados").text(result);
          console.log('fetchAvacadosBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchAvacadosBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchAvacadosBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-avacados").text(result);
          console.log('fetchAvacadosBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
