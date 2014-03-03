l.draw = new Object() // Organize all the draw functions into one object

l.draw.blank = function(color)
{
    if (color)
    {
        l.ctx.fillStyle = color
    }
    else
    {
        l.ctx.fillStyle = l.entities.camera.color
    }
    l.ctx.fillRect(0, 0, l.entities.camera.width, l.entities.camera.height) // Only draw where the camera can see for speed purposes
}

l.draw.rectangle = function(x, y, width, height, color, opacity) // ONLY for debug purposes
{
    if (Math.round(x + width) > Math.round(l.entities.camera.x) && Math.round(x) < Math.round(l.entities.camera.x + l.entities.camera.width) && Math.round(y + height) > Math.round(l.entities.camera.y) && Math.round(y) < Math.round(l.entities.camera.y + l.entities.camera.height)) // Only draw if visible on the screen
    {
        if (opacity)
        {
            l.ctx.globalAlpha = opacity
        }
        l.ctx.fillStyle = color
        l.ctx.fillRect(Math.round(x - l.entities.camera.x), Math.round(y - l.entities.camera.y), width, height)
        if (opacity)
        {
            l.ctx.globalAlpha = 1 // Reset the opacity after drawing the rectangle
        }
    }
}

l.draw.hud = function(name, flipped)
{
    if (l.entities[name])
    {
        if (flipped)
        {
            l.ctx.save()
            if (flipped == 'horizontal')
            {
                l.ctx.translate(Math.round(l.entities[name].x + l.entities[name].width), Math.round(l.entities[name].y))
                l.ctx.scale(-1, 1)
            }
            else if (flipped == 'vertical')
            {
                l.ctx.translate(Math.round(l.entities[name].x), Math.round(l.entities[name].y + l.entities[name].height))
                l.ctx.scale(1, -1)
            }
            else if (flipped == 'both')
            {
                l.ctx.translate(Math.round(l.entities[name].x + l.entities[name].width), Math.round(l.entities[name].y + l.entities[name].height))
                l.ctx.scale(-1, -1)
            }
            
            if (l.entities[name].animate.count)
            {
                l.ctx.drawImage(l.entities[name].sprite, l.entities[name].animate.frame * (l.entities[name].animate.width / l.entities[name].animate.count), 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height, 0, 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height)
            }
            else
            {
                l.ctx.drawImage(l.entities[name].sprite, 0, 0)
            }
            l.ctx.restore()
        }
        else
        {
            if (l.entities[name].animate.count)
            {
                l.ctx.drawImage(l.entities[name].sprite, l.entities[name].animate.frame * (l.entities[name].animate.width / l.entities[name].animate.count), 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height, Math.round(l.entities[name].x), Math.round(l.entities[name].y), l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height)
            }
            else
            {
                l.ctx.drawImage(l.entities[name].sprite, Math.round(l.entities[name].x), Math.round(l.entities[name].y))
            }
        }
    }
    else
    {
        var thingy = Object.keys(l.entities)
        
        for (var i = 0; i < thingy.length; i++)
        {
            if (l.entities[thingy[i]].category == name)
            {
                l.draw.hud(thingy[i], flipped)
            }
        }
    }
}

l.draw.object = function(name, flipped)
{
    if (l.entities[name])
    {
        if (Math.round(l.entities[name].x + l.entities[name].width) > Math.round(l.entities.camera.x) && Math.round(l.entities[name].x) < Math.round(l.entities.camera.x + l.entities.camera.width) && Math.round(l.entities[name].y + l.entities[name].height) > Math.round(l.entities.camera.y) && Math.round(l.entities[name].y) < Math.round(l.entities.camera.y + l.entities.camera.height))  // Only draw if visible on the screen
        {
            if (flipped)
            {
                l.ctx.save()
                if (flipped == 'horizontal')
                {
                    l.ctx.translate(Math.round(l.entities[name].x + l.entities[name].width - l.entities.camera.x), Math.round(l.entities[name].y - l.entities.camera.y))
                    l.ctx.scale(-1, 1)
                }
                else if (flipped == 'vertical')
                {
                    l.ctx.translate(Math.round(l.entities[name].x - l.entities.camera.x), Math.round(l.entities[name].y + l.entities[name].height - l.entities.camera.y))
                    l.ctx.scale(1, -1)
                }
                else if (flipped == 'both')
                {
                    l.ctx.translate(Math.round(l.entities[name].x + l.entities[name].width - l.entities.camera.x), Math.round(l.entities[name].y + l.entities[name].height - l.entities.camera.y))
                    l.ctx.scale(-1, -1)
                }
                
                if (l.entities[name].animate.count)
                {
                    l.ctx.drawImage(l.entities[name].sprite, l.entities[name].animate.frame * (l.entities[name].animate.width / l.entities[name].animate.count), 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height, 0, 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height)
                }
                else
                {
                    l.ctx.drawImage(l.entities[name].sprite, 0, 0)
                }
                l.ctx.restore()
            }
            else
            {
                if (l.entities[name].animate.count)
                {
                    l.ctx.drawImage(l.entities[name].sprite, l.entities[name].animate.frame * (l.entities[name].animate.width / l.entities[name].animate.count), 0, l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height, Math.round(l.entities[name].x - l.entities.camera.x), Math.round(l.entities[name].y - l.entities.camera.y), l.entities[name].animate.width / l.entities[name].animate.count, l.entities[name].animate.height)
                }
                else
                {
                    l.ctx.drawImage(l.entities[name].sprite, Math.round(l.entities[name].x - l.entities.camera.x), Math.round(l.entities[name].y - l.entities.camera.y))
                }
            }

            if (l.debug.anchor || l.debug.all)
            {
                l.draw.rectangle(l.entities[name].anchor.x, l.entities[name].anchor.y, 1, 1, '#ffff00')
            }
            if (l.debug.bounding || l.debug.all)
            {
                l.draw.rectangle(l.entities[name].x + l.entities[name].bounding.offset.x, l.entities[name].y + l.entities[name].bounding.offset.y, l.entities[name].bounding.width, l.entities[name].bounding.height, '#00ff00', 0.5)
            }
            if (l.debug.names || l.debug.all)
            {
                l.text.write(name, l.entities[name].x + l.entities[name].width, l.entities[name].y, '#ff0000')
            }
            if (l.debug.position || l.debug.all)
            {
                l.draw.rectangle(l.entities[name].x, l.entities[name].y, 1, 1, '#0000ff')
            }
        }
    }
    else
    {
        var thingy = Object.keys(l.entities)
        
        for (var i = 0; i < thingy.length; i++)
        {
            if (l.entities[thingy[i]].category == name)
            {
                l.draw.object(thingy[i], flipped)
            }
        }
    }
}