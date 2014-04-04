// "return this" allows for command chaining

var Entity = function()
{
    this.setPosition = function(x, y)
    {
        this.x = x
        this.y = y

        return this
    }

    this.setSize = function(width, height)
    {
        this.width = width
        this.height = height

        return this
    }

    this.setGroup = function(group)
    {
        this.group = group

        return this
    }

    this.setAnchor = function(x, y)
    {
        this.anchor = {xOffset: x, yOffset: y}

        this.x -= this.anchor.xOffset
        this.y -= this.anchor.yOffset

        this.update()

        return this
    }

    this.setBound = function(x, y, width, height)
    {
        this.bound = {xOffset: x, yOffset: y, width: width, height: height}

        this.update()

        return this
    }

    // Throw the preloader counting in here
    this.setSprite = function(location)
    {
        this.sprite = {img: new Image()}

        var parent = this // We can't normally access "this" from inside the eventListener, so we have to hack it to work

        this.sprite.img.addEventListener('load', function()
        {
            parent.sprite.width = this.width
            parent.sprite.height = this.height
        })

        this.sprite.img.src = location

        return this
    }

    this.setAnimation = function(count, timer)
    {
        if (this.sprite)
        {
            this.sprite.frame = 0
            this.sprite.count = count
            this.sprite.timer = timer
            this.sprite.animation = this.animate(this)
        }

        return this
    }

    this.pauseAnimation = function()
    {
        if (this.sprite.animation)
        {
            clearInterval(this.sprite.animation)
        }
    }

    // We're using an external function to circumvent variable scope problems
    this.animate = function(object)
    {
        setInterval(function()
        {
            if (object.sprite.frame < object.sprite.count - 1)
            {
                object.sprite.frame += 1
            }
            else
            {
                object.sprite.frame = 0
            }
        }, object.sprite.timer)
    }

    this.draw = function()
    {
        window.ctx.drawImage(this.sprite.img, Math.round(this.x), Math.round(this.y))
    }

    this.moveSnap = function(x, y)
    {
        if (this.anchor)
        {
            this.x = x - this.anchor.xOffset
            this.y = y - this.anchor.yOffset
        }
        else
        {
            this.x = x
            this.y = y
        }

        this.update()

        return this
    }

    this.moveUp = function(speed)
    {
        this.y -= speed

        this.update()

        return this
    }

    this.moveDown = function(speed)
    {
        this.y += speed

        this.update()

        return this
    }

    this.moveLeft = function(speed)
    {
        this.x -= speed

        this.update()

        return this
    }

    this.moveRight = function(speed)
    {
        this.x += speed

        this.update()

        return this
    }

    this.setFriction = function(friction)
    {
        this.friction = friction
        this.xMomentum = 0
        this.yMomentum = 0

        return this
    }

    this.pushUp = function(force)
    {
        this.yMomentum -= force

        return this
    }

    this.pushDown = function(force)
    {
        this.yMomentum += force

        return this
    }

    this.pushLeft = function(force)
    {
        this.xMomentum -= force

        return this
    }

    this.pushRight = function(force)
    {
        this.xMomentum += force

        return this
    }

    this.pullToward = function(entity, force)
    {
        var xSpeed = this.xMeasure(entity) / this.totalMeasure(entity) * force
        var ySpeed = this.yMeasure(entity) / this.totalMeasure(entity) * force

        if (this.totalMeasure(entity) > 0)
        {
            if (this.anchor.x < entity.anchor.x && this.anchor.y < entity.anchor.y)
            {
                this.pushRight(xSpeed)
                this.pushDown(ySpeed)
            }
            else if (this.anchor.x > entity.anchor.x && this.anchor.y < entity.anchor.y)
            {
                this.pushLeft(xSpeed)
                this.pushDown(ySpeed)
            }
            else if (this.anchor.x < entity.anchor.x && this.anchor.y > entity.anchor.y)
            {
                this.pushRight(xSpeed)
                this.pushUp(ySpeed)
            }
            else if (this.anchor.x > entity.anchor.x && this.anchor.y > entity.anchor.y)
            {
                this.pushLeft(xSpeed)
                this.pushUp(ySpeed)
            }
        }
    }

    this.bounce = function(xMin, xMax, yMin, yMax)
    {
        if (!xMin && !xMax && !yMin && !yMax)
        {
            xMin = 0
            xMax = window.dom.width
            yMin = 0
            yMax = window.dom.height
        }

        if (!this.bound)
        {
            this.setBound(0, 0, this.width, this.height)
        }

        if (this.x + this.bound.xOffset <= xMin)
        {
            this.x = xMin - this.bound.xOffset
            this.xMomentum = -this.xMomentum
        }
        else if (this.x + this.bound.xOffset + this.bound.width >= xMax)
        {
            this.x = xMax - this.bound.width - (this.width - this.bound.xOffset - this.bound.width)
            this.xMomentum = -this.xMomentum
        }

        if (this.y + this.bound.yOffset <= yMin)
        {
            this.y = yMin - this.bound.yOffset
            this.yMomentum = -this.yMomentum
        }
        else if (this.y + this.bound.yOffset + this.bound.height >= yMax)
        {
            this.y = yMax - this.bound.height - (this.height - this.bound.yOffset - this.bound.height)
            this.yMomentum = -this.yMomentum
        }

        return this
    }

    this.physics = function() // Run to continuously update the friction of objects influenced by physics
    {
        if (this.xMomentum !== 0) // Horizontal motion
        {
            if (this.xMomentum < 0) // Moving left
            {
                this.moveLeft(Math.abs(this.xMomentum))
                this.xMomentum += this.friction

                if (this.xMomentum > 0)
                {
                    this.xMomentum = 0
                }
            }
            else if (this.xMomentum > 0) // Moving right
            {
                this.moveRight(Math.abs(this.xMomentum))
                this.xMomentum -= this.friction

                if (this.xMomentum < 0)
                {
                    this.xMomentum = 0
                }
            }
        }

        if (this.yMomentum !== 0) // Vertical motion
        {
            if (this.yMomentum < 0) // Moving up
            {
                this.moveUp(Math.abs(this.yMomentum))
                this.yMomentum += this.friction

                if (this.yMomentum > 0)
                {
                    this.yMomentum = 0
                }
            }
            else if (this.yMomentum > 0) // Moving down
            {
                this.moveDown(Math.abs(this.yMomentum))
                this.yMomentum -= this.friction

                if (this.yMomentum < 0)
                {
                    this.yMomentum = 0
                }
            }
        }

        this.update()

        return this
    }

    // Must manually run when "this.x" or "this.y" change
    this.update = function()
    {
        if (!this.x && !this.y)
        {
            this.x = 0
            this.y = 0
        }

        if (this.anchor)
        {
            this.anchor.x = this.x + this.anchor.xOffset
            this.anchor.y = this.y + this.anchor.yOffset
        }

        if (this.bound)
        {
            this.bound.x = this.x + this.bound.xOffset
            this.bound.y = this.y + this.bound.yOffset
        }

        // Don't "return this" here, do it in the functions that call "this.update" instead
    }

    this.xMeasure = function(entity)
    {
        return Math.round(Math.abs(this.anchor.x - entity.anchor.x))
    }

    this.yMeasure = function(entity)
    {
        return Math.round(Math.abs(this.anchor.y - entity.anchor.y))
    }

    this.totalMeasure = function(entity)
    {
        var horizontal = this.xMeasure(this.anchor.x, entity.anchor.x)
        var vertical = this.yMeasure(this.anchor.y, entity.anchor.y)

        return Math.rounf(Math.sqrt(horizontal * horizontal + vertical * vertical))
    }
}