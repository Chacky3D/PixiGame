export class CreditManager
{
    constructor()
    {
        this.credits = 0;
    }
    
    addCredits(amount)
    {
        this.credits += amount;
    }

    removeCredits(amount)
    {
        if (this.credits >= amount) {
            this.credits -= amount;
        }
    }
}