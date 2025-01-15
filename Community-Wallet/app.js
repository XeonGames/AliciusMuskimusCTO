document.addEventListener("DOMContentLoaded", async () => {
    const walletAddress = "4mJwXjFeMWFrXvArhBGKqud5nqzHkLwaGxpVKeBJRupk";
    const walletBalanceElement = document.getElementById("wallet-balance");
    const transactionsListElement = document.getElementById("transactions-list");

    try {
        // Connect to the Solana blockchain using the provided RPC URL
        const connection = new solanaWeb3.Connection("https://solana-mainnet.g.alchemy.com/v2/EFfiv0vt96UIdI97BEuoNH06dHinhoKh");

        // Fetch wallet balance
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        walletBalanceElement.textContent = `${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2)} SOL`;

        // Fetch recent transactions (limit 1000)
        const confirmedSignatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        transactionsListElement.innerHTML = ""; // Clear placeholder

        // Fetch transaction details for each signature
        for (const signatureInfo of confirmedSignatures) {
            const transactionDetails = await connection.getTransaction(signatureInfo.signature, {
                maxSupportedTransactionVersion: 0, // Ensure compatibility with version 0
            });

            if (transactionDetails && transactionDetails.meta) {
                const transactionAmount = transactionDetails.meta.postBalances[0] - transactionDetails.meta.preBalances[0];
                const solAmount = transactionAmount / solanaWeb3.LAMPORTS_PER_SOL;

                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="https://explorer.solana.com/tx/${signatureInfo.signature}?cluster=mainnet-beta" target="_blank">
                        Transaction: ${signatureInfo.signature}
                    </a>
                    <p>Amount: ${solAmount.toFixed(2)} SOL</p>
                `;
                transactionsListElement.appendChild(listItem);
            }
        }
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        walletBalanceElement.textContent = "Error loading balance.";
        transactionsListElement.innerHTML = "<li>Error loading transactions.</li>";
    }
});
