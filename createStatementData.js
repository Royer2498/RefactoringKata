class PerformanceCalculator{
    constructor(aPerformance,aPlay){
        this.aPerformance = aPerformance;
        this.aPlay = aPlay;
    }

    get amount(){
        throw new Error('subclass responsibility');
    }

    get volumeCredits(){
        let result = 0;
        result += Math.max(this.aPerformance.audience - 30, 0);
        if ("comedy" === this.aPlay.type)
            result += Math.floor(this.aPerformance.audience / 5);
        return result;
    }
    
}

class TragedyCalculator extends PerformanceCalculator {
    get amount(){
        let result = 40000;
        if (this.aPerformance.audience > 30) {
            result += 1000 * (this.aPerformance.audience - 30);
        }
        return result;
    }
}
class ComedyCalculator extends PerformanceCalculator {
    get amount(){
        let result = 30000;
        if (this.aPerformance.audience > 20) {
            result += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        result += 300 * this.aPerformance.audience;
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

    function createPerformanceCalculator(aPerformance,aPlay){
        switch(aPlay.type){
            case "tragedy":
                return new TragedyCalculator(aPerformance,aPlay);
            case "comedy":
                return new ComedyCalculator(aPerformance,aPlay);
            default:
                throw new Error(`unknown type: ${aPlay.type}`);

        }
    }
    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance,playFor(aPerformance));
        let result = Object.assign({}, aPerformance);
        result.play = calculator.aPlay;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data){
        return data.performances.reduce( (total,performance) => total += performance.amount,0);
    }

    function totalVolumeCredits(data){
        return data.performances.reduce( (total,performance) => total += performance.volumeCredits,0);
    }
}

