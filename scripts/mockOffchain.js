const { ethers, network } = require("hardhat")

async function mockKeepers() {
    const auctionv2 = await ethers.getContract("AuctionV2")
    // we dont need to specify anything in the checkdata
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    const { upkeepNeeded } = await auctionv2.callStatic.checkUpkeep(checkData)
    if (upkeepNeeded) {
        const tx = await auctionv2.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        console.log(`Performed upkeep`)
        if (network.config.chainId == 31337) {
            await getHighestBidders()
        }
    } else {
        console.log("No upkeep needed!")
    }
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
