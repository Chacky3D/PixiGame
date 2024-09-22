export class CreditManager
{
    constructor()
    {
        this.credits = 0;
    }
    
    addCredits(creditsToAdd) {
        this.credits += creditsToAdd;
    }
}