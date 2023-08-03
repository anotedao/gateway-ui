// import { MetaMaskSDK } from '@metamask/sdk';
import { AnoteAbi } from './anoteabi';
import { ethers } from 'ethers';
import { ExternalProvider } from "@ethersproject/providers";
import $ from 'jquery';

const contractAddress = '0xbad04e33cc88bbcccc1b7adb8319f7d36f5bc472';
// const contractAddress = '0xae60E1a4eF26671807411368Cc150631eF1456Fd';

let signer;
let provider;
let contract;

declare global {
    interface Window {
        ethereum?: ExternalProvider;
    }
}

const start = async () => {
    if (window.ethereum !== undefined && window.ethereum.request !== undefined) {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
            params: [],
        });

        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = await provider.getSigner();

        if (signer != null) {
            contract = new ethers.Contract(contractAddress, AnoteAbi, signer);
            contract.connect(provider);
    
            if (accounts != null) {
                var we = await contract.withdrawExists(accounts[0]);
                if (we) {
                    $("#wbtn").removeClass("btn-secondary");
                    $("#wbtn").addClass("btn-success");
                    $("#wbtn").prop("disabled", false);
                } else {
                    $("#nowe").fadeIn();
                }
            }
        }
    }
};

if (window.ethereum == null || window.ethereum == undefined) {
    $("#loading").fadeOut(function() {
        $("#error").fadeIn();
    });
} else {
    $("#loading").fadeOut(function() {
        $("#success").fadeIn();
        start();
    });
}

$("#wbtn").on("click", async function() {
    $("#errMsg").fadeOut(function() {
        $("#errMsg").html('');
    });
    $("#success").fadeOut(async function() {
        $("#loading").fadeIn();

        const options = {value: ethers.utils.parseEther("0.001")};
        try {
            var tx = await contract.withdraw(options);
            var r = await tx.wait();
            $("#loading").fadeOut(function() {
                $("#success").fadeIn();
            });
        } catch (e: any) {
            console.log(e);
            $("#errMsg").html(e.message);
            $("#errMsg").show();
            $("#loading").fadeOut(function() {
                $("#success").fadeIn();
            });
        }
    });
});

$("#dbtn").on("click", async function() {
    $("#errMsg").fadeOut(function() {
        $("#errMsg").html('');
    });
    var address = $("#address").val();
    var amount = $("#amount").val();

    if (address && amount && address?.toString().length > 0 && amount?.toString().length > 0) {
        $("#success").fadeOut(async function() {
            $("#loading").fadeIn();

            var address = $("#address").val();
            var amount = $("#amount").val();

            if (address && amount && address?.toString().length > 0 && amount?.toString().length > 0) {
                try {
                    amount = Math.floor(parseFloat(amount?.toString()) * 100000000);
                    var tx = await contract.deposit(address, amount);
                    await tx.wait()
                } catch (e: any) {
                    console.log(e);
                    $("#errMsg").html(e.message);
                    $("#errMsg").show();
                }
        
                $("#address").val('');
                $("#amount").val('');
            }
    
            $("#loading").fadeOut(function() {
                $("#success").fadeIn();
            });
        });
    } else {
        $("#errMsg").html("Both fields are required.");
        $("#errMsg").fadeIn(function() {
            setTimeout(function() {
                $("#errMsg").fadeOut();
            }, 2000);
        });
    }
});