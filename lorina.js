var l = new Object() // The Lorina object that keeps the engine functions out of the way

l.game = new Object() // Group the game functions
l.debug = new Object() // Keep track of the various debug options

l.game.setup = function(gameColor)
{
    l.dom = document.getElementById('canvas')
    l.ctx = document.getElementById('canvas').getContext('2d')

    l.canvas = new Object() // Used to reference the height and width of the canvas later on without breaking other functions
        l.canvas.width = parseInt(document.getElementById('canvas').width)
        l.canvas.height = parseInt(document.getElementById('canvas').height)

    if (!window.navigator.vendor)
    {
        l.canvas.agent = 'ejecta'
    }
    else if (window.navigator.vendor == 'Google Inc.')
    {
        l.canvas.agent = 'chrome'
    }

    l.object.make('camera', 0, 0, parseInt(document.getElementById('canvas').width), parseInt(document.getElementById('canvas').height))
    l.entities.camera.color = gameColor
    l.entities.camera.previous = new Object() // Keep track of the camera's previous position for use with the shaking function
        l.entities.camera.previous.x = l.entities.camera.x
        l.entities.camera.previous.y = l.entities.camera.y
}

l.game.start = function()
{
    l.game.loop = setInterval(game, 1000 / 60)
}

l.game.stop = function() // Only works once the game is running; no effect during loading or setup
{
    clearInterval(l.game.loop)
}

l.camera = new Object() // Group the camera functions

l.camera.follow = function(name, sandboxWidth, sandboxHeight)
{
    if (!l.entities.camera.shaking)
    {
        l.entities.camera.following = true // Tell the world that we're following something with the camera

        if (sandboxWidth)
        {
            if (l.entities[name].anchor.x < l.entities.camera.x + l.entities.camera.width / 2 - sandboxWidth / 2)
            {
                l.entities.camera.x = Math.round(l.entities[name].anchor.x - l.entities.camera.width / 2 + sandboxWidth / 2)
            }
            else if (l.entities[name].anchor.x > l.entities.camera.x + l.entities.camera.width / 2 + sandboxWidth / 2)
            {
                l.entities.camera.x = Math.round(l.entities[name].anchor.x - l.entities.camera.width / 2 - sandboxWidth / 2)
            }
        }

        if (sandboxHeight)
        {
            if (l.entities[name].anchor.y < l.entities.camera.y + l.entities.camera.height / 2 - sandboxHeight / 2)
            {
                l.entities.camera.y = Math.round(l.entities[name].anchor.y - l.entities.camera.height / 2 + sandboxHeight / 2)
            }
            else if (l.entities[name].anchor.y > l.entities.camera.y + l.entities.camera.height / 2 + sandboxHeight / 2)
            {
                l.entities.camera.y = Math.round(l.entities[name].anchor.y - l.entities.camera.height / 2 - sandboxHeight / 2)
            }
        }

        if (l.entities.camera.x < 0)
        {
            l.entities.camera.x = 0
        }
        else if (l.entities.camera.x > l.canvas.width - l.entities.camera.width)
        {
            l.entities.camera.x = l.canvas.width - l.entities.camera.width
        }

        if (l.entities.camera.y < 0)
        {
            l.entities.camera.y = 0
        }
        else if (l.entities.camera.y > l.canvas.height - l.entities.camera.height)
        {
            l.entities.camera.y = l.canvas.height - l.entities.camera.height
        }
    }
}

l.camera.reset = function()
{
    l.entities.camera.x = 0
    l.entities.camera.y = 0
}

l.camera.shake = function(shakes, duration, severity)
{
    if (l.entities.camera.following)
    {
        l.entities.camera.shaking = true // Tell the "following" function that we're shaking
    }

    // "Back up" the camera's position
    l.entities.camera.previous.x = l.entities.camera.x
    l.entities.camera.previous.y = l.entities.camera.y

    var timing = duration / (shakes * 2)

    for (var i = 0; i < shakes * 2; i++)
    {
        if (i % 2 == 0)
        {
            setTimeout(function() // Set the timeout that will reset the camera back to its proper position
            {
                l.entities.camera.x = l.entities.camera.previous.x
                l.entities.camera.y = l.entities.camera.previous.y
            }, timing * i)
        }
        else
        {
            setTimeout(function()
            {
                var xMovement = Math.round(l.tools.random(0 - severity / 2, severity / 2))
                var yMovement = Math.round(l.tools.random(0 - severity / 2, severity / 2))

                if (xMovement > 0)
                {
                    if (l.entities.camera.x + xMovement < l.canvas.width - l.entities.camera.width)
                    {
                        l.entities.camera.x += xMovement
                    }
                }
                else
                {
                    if (l.entities.camera.x - Math.abs(xMovement) > 0)
                    {
                        l.entities.camera.x = l.entities.camera.x - Math.abs(xMovement)
                    }
                }

                if (yMovement > 0)
                {
                    if (l.entities.camera.y + yMovement < l.canvas.height - l.entities.camera.height)
                    {
                        l.entities.camera.y += yMovement
                    }
                }
                else
                {
                    if (l.entities.camera.y - Math.abs(yMovement) > 0)
                    {
                        l.entities.camera.y -= Math.abs(yMovement)
                    }
                }
            }, timing * i)
        }
    }

    setTimeout(function()
    {
        if (l.entities.camera.following)
        {
            l.entities.camera.shaking = false // Tell the following function that we're done shaking
        }
    }, duration)
}

l.tools = new Object() // Group the tool functions

l.tools.random = function(min, max)
{
    return Math.random() * (max - min) + min
}