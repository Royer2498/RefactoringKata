class PerformanceCalculator{
    constructor(aPerformance,aPlay){
        this.aPerformance = aPerformance;
        this.aPlay = aPlay;
    }

    get amount(){
        let result = 0;
        switch (this.aPlay.type) {
            case "tragedy":
                result = 40000;
                if (this.aPerformance.audience > 30) {
                    result += 1000 * (this.aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.aPerformance.audience > 20) {
                    result += 10000 + 500 * (this.aPerformance.audience - 20);
                }
                result += 300 * this.aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.aPerformance.play.type}`);
        }
        return result;
    }
}

export default function createStatementData(invoice,plays){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = new PerformanceCalculator(aPerformance,playFor(aPerformance));
        let result = Object.assign({}, aPerformance);
        result.play = calculator.aPlay;
        result.amount = calculator.amount;
        result.volumeCredits = volumeCreditFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditFor(aPerformance){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data){
        return data.performances.reduce( (total,performance) => total += performance.amount,0);
    }

    function totalVolumeCredits(data){
        return data.performances.reduce( (total,performance) => total += performance.volumeCredits,0);
    }

}

