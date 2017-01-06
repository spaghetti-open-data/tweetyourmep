

[ updates 2017-01-05, WIP ]


# EU news Hub

http://www.epnewshub.eu/


+ The original source:
http://www.epnewshub.eu/feederfrontendapi/contributors/1?limit=8000&offset=0
seems not to work anymore

+ New source: We could instead expand the available information using content at:
http://www.epnewshub.eu/newshub/rest/feedItems/find?types=facebook&types=twitter&types=flickr&types=googleplus&types=instagram&types=youtube&types=vimeo&types=rss

This JSON stream seems to contain contents from the web activity, so it coudl be not full, and yet it should contain more informations about other possibile social profiles.

+ New source example: gathering social interactions from a date

fromDate:1483683360000
types:facebook
types:twitter
types:flickr
types:googleplus
types:instagram
types:youtube
types:vimeo
types:rss

+ New souce example: retrieving data for a single MEP
http://www.epnewshub.eu/newshub/rest/contributors/find?limit=20&cType=mep&cIds=96736
























