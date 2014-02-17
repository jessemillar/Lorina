l.audio = new Object() // Group the audio functions
l.audio.files = new Object() // The place where we'll store all the loaded sound files

l.audio.make = function(name, location)
{
    l.preloader.queue()
    l.audio.files[name] = document.createElement('audio')
        l.audio.files[name].setAttribute('preload', 'auto')
        l.audio.files[name].src = location
        l.audio.files[name].onloadeddata = function()
        {
            l.preloader.update()
        }
}

l.audio.pause = function(name)
{
    l.audio.files[name].pause()
}

l.audio.play = function(name)
{
    if (l.audio.files[name].paused && l.audio.files[name].currentTime == 0)
    {
        l.audio.files[name].play()
    }
}

l.audio.rewind = function(name)
{
    l.audio.files[name].currentTime = 0
    l.audio.files[name].load() // Let's see if we can fix a Chrome bug
}

l.audio.loop = function(name)
{
    if (l.audio.files[name].paused)
    {
        l.audio.files[name].play()
    }
}