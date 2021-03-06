// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { TextInput } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
// import { Input } from '../src'
import Input from '../src/components/Input'

describe('<Input /> & <Textarea>', () => {
  describe('events', () => {
    it('onKeyDown', () => {
      const spy = sinon.spy()
      const wrapper = shallow(<Input onKeyDown={spy} />)
      // eslint-disable-next-line
      // @ts-ignore
      wrapper.find(TextInput).props().onKeyPress({ nativeEvent: { key: 'Enter' } } as any)
      expect(spy.calledOnce).toBe(true)
      expect(spy.args[0][0]).toMatchObject({
        which: 13,
        target: expect.objectContaining({
          value: expect.any(String)
        })
      })
    })
  })

  describe('prop value changed', () => {
    it('should be new value', () => {
      const wrapper = shallow(<Input value={'default text'} />)
      // expect(wrapper.state('returnValue')).toBe('default text')
      wrapper.setProps({ value: 'new text' })
      expect(wrapper.state('returnValue')).toBe('new text')
    })
  })
})
