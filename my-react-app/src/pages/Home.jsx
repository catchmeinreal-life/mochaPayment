import NavBar from "../components/NavBar";
import '../styles/global.css';


export default function Home({ onLogout, isAuthenticated }) {
  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header text-center">
                <h1>Welcome to MochaPay</h1>
                <p>Your trusted digital payment solution</p>
              </div>
              <div className="card-body">
                {isAuthenticated ? (
                  <div className="text-center">
                    <div className="alert alert-success">
                      <strong>Welcome back!</strong> You are successfully logged in.
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>💰</h3>
                            <h5>Account Balance</h5>
                            <p className="text-muted">$2,450.00</p>
                            <a href="/dashboard" className="btn btn-primary">View Dashboard</a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>💸</h3>
                            <h5>Send Money</h5>
                            <p className="text-muted">Transfer funds instantly</p>
                            <a href="/payment" className="btn btn-success">Send Now</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-info">
                      Please log in to access your dashboard and start making payments.
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>🔐</h3>
                            <h5>Secure Payments</h5>
                            <p className="text-muted">Bank-level security for all transactions</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>⚡</h3>
                            <h5>Instant Transfers</h5>
                            <p className="text-muted">Send money in seconds, not days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <a href="/login" className="btn btn-primary">Get Started</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}