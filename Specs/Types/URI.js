/*
---
name: URI Tests
requires: [More/URI]
provides: [URI.Tests]
...
*/

(function(){

	var uri;

	describe('URI initialize', function(){

		it('new URI() should return the current location', function(){
			expect(new URI().toString()).toEqual(window.location.href.replace(/#$|\?$|\?(?=#)/, ''));
		});

		it('new URI(\'http://www.calyptus.eu\') should return itself with a trailing slash', function(){
			expect(new URI('http://www.calyptus.eu').toString()).toEqual('http://www.calyptus.eu/');
		});

		it('new URI(\'http://www.calyptus.eu/\') should return itself', function(){
			expect(new URI('http://www.calyptus.eu/').toString()).toEqual('http://www.calyptus.eu/');
		});

		it('\'http://www.calyptus.eu/\' + \'./mydirectory/myfile.html\' == http://www.calyptus.eu/mydirectory/myfile.html', function(){
			expect(new URI('./mydirectory/myfile.html', { base: 'http://www.calyptus.eu/' }).toString()).toEqual('http://www.calyptus.eu/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu\' + \'mydirectory/myfile.html\' == http://www.calyptus.eu/mydirectory/myfile.html', function(){
			expect(new URI('mydirectory/myfile.html', { base: 'http://www.calyptus.eu' }).toString()).toEqual('http://www.calyptus.eu/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory/#\' + \'../myfile.html\' == http://www.calyptus.eu/myfile.html', function(){
			expect(new URI('../myfile.html', { base: 'http://www.calyptus.eu/mydirectory/#' }).toString()).toEqual('http://www.calyptus.eu/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory/mydirectory2/\' + \'../../myfile.html\' == http://www.calyptus.eu/myfile.html', function(){
			expect(new URI('../../myfile.html', { base: 'http://www.calyptus.eu/mydirectory/mydirectory2/' }).toString()).toEqual('http://www.calyptus.eu/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory/mydirectory2/\' + \'../test/../myfile.html\' == http://www.calyptus.eu/mydirectory/myfile.html', function(){
			expect(new URI('../test/../myfile.html', { base: 'http://www.calyptus.eu/mydirectory/mydirectory2/' }).toString()).toEqual('http://www.calyptus.eu/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu/\' + \'http://otherdomain/mydirectory/myfile.html\' == http://otherdomain/mydirectory/myfile.html', function(){
			expect(new URI('http://otherdomain/mydirectory/myfile.html', { base: 'http://www.calyptus.eu/' }).toString()).toEqual('http://otherdomain/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory2/myfile.html\' + \'/mydirectory/myfile.html\' == http://www.calyptus.eu/mydirectory/myfile.html', function(){
			expect(new URI('/mydirectory/myfile.html', { base: 'http://www.calyptus.eu/mydirectory2/myfile.html' }).toString()).toEqual('http://www.calyptus.eu/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory2/\' + \'mydirectory/myfile.html\' == http://www.calyptus.eu/mydirectory2/mydirectory/myfile.html', function(){
			expect(new URI('mydirectory/myfile.html', { base: 'http://www.calyptus.eu/mydirectory2/myfile.html' }).toString()).toEqual('http://www.calyptus.eu/mydirectory2/mydirectory/myfile.html');
		});

		it('\'http://www.calyptus.eu/mydirectory2/\' + \'mydirectory\' == http://www.calyptus.eu/mydirectory2/mydirectory', function(){
			expect(new URI('mydirectory', { base: 'http://www.calyptus.eu/mydirectory2/myfile.html' }).toString()).toEqual('http://www.calyptus.eu/mydirectory2/mydirectory');
		});

		it('\'http://www.calyptus.eu/mydirectory/mydirectory2/myfile.html\' + \'..\' == http://www.calyptus.eu/mydirectory/', function(){
			expect(new URI('..', { base: 'http://www.calyptus.eu/mydirectory/mydirectory2/myfile.html' }).toString()).toEqual('http://www.calyptus.eu/mydirectory/');
		});

		it('Should decode + into space in the query portion of the url', function(){
			expect(new URI('http://example.com/?key=a+b%2Bc').getData('key')).toEqual('a b+c');
		});

		it('Query String can contain @ symbol', function(){
			expect(new URI('http://www.calyptus.eu/myfile.html?email=somebody@gmail.com').get('host')).toEqual('www.calyptus.eu');
		});

	});

	describe('URI methods without query in url', function(){

		beforeEach(function(){
			uri = new URI('http://www.calyptus.eu/mydirectory/mydirectory2/myfile.html');
		});

		it('URI.toString() should be same as input', function(){
			expect(uri.toString()).toEqual('http://www.calyptus.eu/mydirectory/mydirectory2/myfile.html');
		});

		it('URI.setData({ keyName: \'my value\' }) should return ?keyName=my%20value as the query', function(){
			uri.setData('keyName', 'myOtherValue');
			expect(uri.get('query')).toEqual('keyName=myOtherValue');
			uri.setData({ keyName: 'my value' });
			expect(uri.get('query')).toEqual('keyName=my%20value');
		});
	});

	describe('URI methods with query in url', function(){

		beforeEach(function(){
			uri = new URI('http://www.calyptus.eu/mydirectory/mydirectory2/myfile.html?keyName=my%20value');
		});
        
		it('URI.getData() should return an object with the value set above', function(){
			expect(uri.getData().keyName).toEqual('my value');
		});

		it('URI.getData(\'keyName\') should return the string with the value set above', function(){
			expect(uri.getData('keyName')).toEqual('my value');
		});

	});

	describe('URI use where string is expected', function(){

		it('Request self should work with an URI object', function(){
			new Request({url: new URI()}).get();
		});

		it('A HREF should take an URI object', function(){
			expect(new Element('a').set('href', new URI()).get('href')).toEqual(new URI().toString());
		});

		it('post-concatenation with string', function(){
			expect(new URI('http://www.calyptus.eu/') + '?test').toEqual('http://www.calyptus.eu/?test');
		});

		it('pre-concatenation with string', function(){
			expect('URL: ' + new URI('http://www.calyptus.eu/')).toEqual('URL: http://www.calyptus.eu/');
		});

		it('regexp test', function(){
			expect(/^http/.test(new URI('http://www.calyptus.eu/'))).toEqual(true);
		});

	});

	describe("URI merging", function(){

		var myURI;
		beforeEach(function(){
			myURI = new URI('http://user:password@www.test.com:8383/the/path.html?param=value&animal=cat#car=ferrari');
		});

		it("should retrieve the 'fragment' part", function(){
			expect(myURI.get('fragment')).toEqual('car=ferrari');
		});

		it("should insert new data into 'fragment'", function(){
			myURI.setData({
				color: 'blue'
			}, true, 'fragment')
			expect(myURI.get('fragment')).toEqual('car=ferrari&color=blue');
		});

		it("should merge values from setData into URI overriding old keys with new value", function(){

			var inicialQuery = myURI.get('query');
			expect(inicialQuery).toEqual('param=value&animal=cat');

			myURI.setData({
				foo: 'bar',
				animal: 'dog'
			}, true);
			var finalQuery = myURI.get('query');
			expect(finalQuery).toEqual('param=value&animal=dog&foo=bar');

		});
	});

	describe('URI ipv6', function(){
		var suite = [
			["http://10.0.0.1/", "10.0.0.1"],
			["http://192.168.0.4/foo?bar#baz", "192.168.0.4"],
			["http://192.168.0.4:60/foo?bar#baz", "192.168.0.4"],
			["http://foo@192.168.0.4/foo?bar#baz", "192.168.0.4"],
			["http://foo:bar@192.168.0.4/foo?bar#baz", "192.168.0.4"],
			["http://foo:bar@192.168.0.4:8080/foo?bar#baz", "192.168.0.4"],
			["http://foo:bar@[::1]:8080/foo?bar#baz", "[::1]"],
			["http://foo:bar@[FE80::0202:B3FF:FE1E:8329]:8080/foo?bar#baz", "[FE80::0202:B3FF:FE1E:8329]"],
			["http://foo:bar@[2001:db8::1]:8080/foo?bar#baz", "[2001:db8::1]"]
		];

		suite.each(function(test){
			it('resolve uri properly', function(){
				var uri = test[0];
				var control = test[1];
				var url = new URI(uri);
				var res = url.toString();
				var resHost = url.get('host');
				expect(resHost).toBe(control);
				expect(res).toBe(uri);
			});
		});
	});

})();
