export class ScoreManager
{
    constructor()
    {
        this.score = 0;
    }
    
    addScore(amount)
    {
        this.score += amount;
    }
}