export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Viewzenix</h1>
      <p className="text-lg mb-4">
        Trading webhook platform for connecting TradingView alerts to broker APIs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-3">Configure Webhooks</h2>
          <p>Set up webhook endpoints to receive trading signals from TradingView</p>
        </div>
        <div className="bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-3">Connect Brokers</h2>
          <p>Link your trading accounts with supported brokers like Alpaca</p>
        </div>
        <div className="bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-3">Manage Bots</h2>
          <p>Create and manage automated trading bots with custom strategies</p>
        </div>
      </div>
    </div>
  )
}