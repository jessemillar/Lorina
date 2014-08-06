var Accelerometer = function()
{
    var self = this

    this.x = 0
    this.y = 0
    this.z = 0

    window.addEventListener('deviceorientation', function(event)
    {
        self.x = event.beta
        self.y = event.gamma
        self.z = event.alpha
    }, true)
}