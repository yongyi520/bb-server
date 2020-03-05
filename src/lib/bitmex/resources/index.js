const map = {
  announcement: 'announcement',
  order: 'order', 
  position: 'position'
}

export const registerAll = function(BitmexClient) {
  Object.keys(map).forEach(prop => {
    Object.defineProperty(BitmexClient.prototype, prop, {
      configurable: true,
      get: function get() { 
        const resource = require(`./${map[prop]}`);
        return Object.defineProperty(this, prop, {
          value: new resource.default(this)
        })[prop];
      },
      set: function set(value) {
        return Object.defineProperty(this, prop, { value })[prop];
      }
    })
  })

}