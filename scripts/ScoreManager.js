export class ScoreManager
{
    constructor()
    {
        this.score = 0;
    }
    
    addScore(scoreToAdd) {
        this.score += scoreToAdd;
    }
}