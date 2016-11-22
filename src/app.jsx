import styles from "./index.scss";
import React, {Component} from "react";
import axios from "axios";

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			visitors: [],
			count: 0,
			visitor: null
		};
		this.configPusher = this.configPusher.bind(this);
	}
	componentDidMount() {
		this.configPusher();
	}
	async configPusher() {
		let visitorList = [];
		const PUSHER_KEY = "17f5eb2c46f9806ed5c9";
		try {
			const userData = await axios.get("https://ipinfo.io/ip");
			const pusher = new Pusher(PUSHER_KEY, {
		    	authTransport: "jsonp",
		    	channel_name: "presence-pushit-channel",
			    authEndpoint: `/api/pusher/auth/${userData.data}`, //change here to your backend domain if you have an external domain
			    encrypted: true
		    });
		    const channel = pusher.subscribe("presence-pushit-channel");
		    channel.bind("pusher:subscription_succeeded", (members) => {
		    	let visitor = members.me;
		    	members.each(function(member) {
			    	visitorList.push(member);
			    });
		    	this.setState({
		    		visitors: visitorList,
		    		count: members.count,
		    		visitor
		    	});
			});
			channel.bind("pusher:member_added", (member) => {
				const visitors = [...this.state.visitors];
				const memberIndex = visitors.map(v => v.id ).indexOf(member.id);
				let updateCount = this.state.count;
				if(memberIndex < 0) {
					visitors.push(member);
					updateCount += 1;
				}
				this.setState({
					visitors,
					count: updateCount
				});
			});

			channel.bind("pusher:member_removed", (member) => {
				const visitors = [...this.state.visitors];
				let updateCount = this.state.count;
				let pusher = new Pusher(PUSHER_KEY);
				//unsub user from getting futher messages
				pusher.unsubscribe("presence-pushit-channel");
				const memberIndex = visitors.map(v => v.id ).indexOf(member.id);
				if(memberIndex > -1) {
					visitors.splice(memberIndex, 1);
					updateCount -= 1;
				};
				this.setState({
					visitors,
					count: updateCount
				});
			});
		} catch(error) {
			console.log("error", error)
		}
	}
	render() {
		const {visitors, count, visitor} = this.state;
		return (
			<div>

			<nav className="navbar navbar-default">
			  <div className="container-fluid">
			    <div className="navbar-header">
			      <a className="navbar-brand" href="#">
			      	<img height="50" style={{display: "inline-block"}} src="https://avatars3.githubusercontent.com/u/739550?v=3&s=200" />
			      	<p style={{display: "inline-block"}}>Pusher</p>
			      </a>
			    </div>
			  </div>
			</nav>

			<div className="container">
				<br />
				<div className="row">
					<div className="dual-list list-left col-md-5">
						<div className="well text-right" style={{background: "#fff"}}>
							<div className="row">
								<div className="col-md-12">
									<h4>Your Details</h4>
								</div>
							</div>
							<ul className="list-group">
								{ visitor ? <li className="list-group-item">
									<p>{visitor.info.name}</p>
									<p>{visitor.info.user_ip}</p>
								</li> :
								<li className="list-group-item">Fetching your info .... </li>}
							</ul>
						</div>
					</div>
					<div className="dual-list list-right col-md-5">
						<div className="well" style={{background: "#fff"}}>
							<div className="row">
								<div className="col-md-12">
									<h4>Visitor IP Adresses. <small>Including yours though.</small></h4>
								</div>
							</div>
							<ul className="list-group">
							{
								visitors && visitors.length > 0 ? visitors.map((value, index) =>
									<li className="list-group-item" key={index}>{value.info.name} - {value.info.user_ip}</li>
								) :
								<li className="list-group-item">Loading ..... </li>
							}
							</ul>
							<p>Currently viewing: {count}</p>
						</div>
					</div>
				</div><br/><br/>
				<p style={{textAlign: "center"}}>Displays a list of users ip addresses currently visiting the page.The names
				are randomly generated.
				</p>
			</div>
		</div>
		)
	}
}
