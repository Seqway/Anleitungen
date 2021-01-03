# **Grafana - more than one value and doing math operations**

```json
// Manual under preparation :construction::construction::construction:
```
:snowman: :snowman:
# **Introduction**

There is one general rules while operating with databases:

If you have the VALUE that you need available but you need to make methematical operations than try to do it directly in Grafana rather then to write a script and put a new datapoint into your database.

Therefore i make an example where you have two different values (metrics) and want to have a third one while adding or subtracting them from each other !

I make it on the example of a solar power unit!

# **Usecase - Solar Power**

1. you have an value of the produced (solar) power actually
2. You have your current load of power demand e.g. from your house
3. Substract power house consumption from your produced power from solar unit to see when i have to buy power from my power supplier

Choose your two datapoints

![](Pics/twovalues.png)

## Known issues

(still) to do or to update

## Support me
If you like my work, please consider a personal donation  
(this is an personal Donate link for me - Seqway aka Dirk)  
[![Donate](https://raw.githubusercontent.com/iobroker-community-adapters/ioBroker.sourceanalytix/master/admin/button.png)](http://paypal.me/Seqway)

## Changelog

### 0.0.1
* (Seqway) official release
